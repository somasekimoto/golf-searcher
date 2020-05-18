// Import Package
import React from "react"
import DatePicker, { registerLocale } from "react-datepicker"
import ja from "date-fns/locale/ja"
import addDays from "date-fns/addDays"
import axios from "axios"
import format from "date-fns/format"
// Import Styles
import "./Common.css"
import "semantic-ui-css/semantic.min.css"
import "react-datepicker/dist/react-datepicker.css"
// Import Component
import Result from "./Result"
import Loading from "./Loading"

// To set default date
const Today = new Date()

registerLocale("ja", ja)

class Home extends React.Component {
  state = {
    // Set the date 14 days later from today
    date: addDays(new Date(), 14),
    budget: "12000",
    departure: "1",
    duration: "90",
    planCount: 0,
    plans: null,
    error: false,
    loading: false,
  }

  onFormSubmit = async (event) => {
    try {
      // To stop submit event & have loading component appeared
      event.preventDefault()
      this.setState({ loading: true })

      // To get info from DynamoDB in AWS according to input_data
      const response = await axios.get(
        "https://zbfiblk00k.execute-api.us-east-1.amazonaws.com/production/golf-courses",
        {
          params: {
            date: format(this.state.date, "yyyyMMdd"),
            budget: this.state.budget,
            departure: this.state.departure,
            duration: this.state.duration,
          },
        }
      )
      // Use response
      this.setState({
        planCount: response.data.count,
        plans: response.data.plans,
      })
      // Do not forget stop Loading Com.
      this.setState({ loading: false })
      // return error if something wrong happen in try
    } catch (error) {
      this.setState({ error: error })
    }
  }

  render() {
    return (
      <div className="ui container" id="container">
        <div className="Search__Form">
          <form className="ui form segment" onSubmit={this.onFormSubmit}>
            <div className="field">
              <label>
                <i className="calendar alternate outline icon"></i>プレー日
              </label>
              <DatePicker
                dateFormat="yyyy/MM/dd"
                locale="ja"
                selected={this.state.date}
                onChange={(e) => this.setState({ date: e })}
                minDate={Today}
              />
            </div>
            <div className="field">
              <label>
                <i className="yen sign icon"></i>上限金額
              </label>
              <select
                className="ui dropdown"
                name="dropdown"
                value={this.state.budget}
                onChange={(e) => this.setState({ budget: e.target.value })}
              >
                <option value="8000">8,000円</option>
                <option value="12000">12,000円</option>
                <option value="16000">16,000円</option>
              </select>
            </div>
            <div className="field">
              <label>
                <i className="map pin icon"></i>
                移動時間計算の出発地点（自宅から近い地点をお選びください）
              </label>
              <select
                className="ui dropdown"
                name="dropdown"
                value={this.state.departure}
                onChange={(e) => this.setState({ departure: e.target.value })}
              >
                <option value="1">東京駅</option>
                <option value="2">横浜駅</option>
              </select>
            </div>
            <div className="field">
              <label>
                <i className="car icon"></i>車での移動時間の上限
              </label>
              <select
                className="ui dropdown"
                name="dropdown"
                value={this.state.duration}
                onChange={(e) => this.setState({ duration: e.target.value })}
              >
                <option value="60">60分</option>
                <option value="90">90分</option>
                <option value="120">120分</option>
              </select>
            </div>
            <div className="Search__Button">
              <button type="submit" className="Search__Button__Design">
                <i className="search icon"></i>ゴルフ場を検索する
              </button>
            </div>
          </form>

          <Loading loading={this.state.loading} />

          <Result
            plans={this.state.plans}
            planCount={this.state.planCount}
            error={this.state.error}
          />
        </div>
      </div>
    )
  }
}

export default Home
