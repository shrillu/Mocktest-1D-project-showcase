import {Component} from 'react'

import Loader from 'react-loader-spinner'

import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// Replace your code here
class App extends Component {
  state = {
    optionSelected: categoriesList[0].id,
    apiStatus: apiConstants.initial,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const {optionSelected} = this.state

    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${optionSelected}`

    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    // console.log(response)
    const fetchedData = await response.json()
    console.log(fetchedData)
    if (response.ok === true) {
      const updatedData = fetchedData.projects.map(eachProject => ({
        id: eachProject.id,
        imageUrl: eachProject.image_url,
        name: eachProject.name,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onClickRetryButton = () => {
    this.getProjects()
  }

  onChangeOption = event => {
    this.setState(
      {optionSelected: event.target.value.toUpperCase()},
      this.getProjects,
    )
  }

  renderProjectsBasedOnApi = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderSuccessView = () => {
    const {projectsList} = this.state

    return (
      <ul className="ul-container">
        {projectsList.map(eachItem => (
          <li key={eachItem.id} className="list-item ">
            <img
              src={eachItem.imageUrl}
              alt={eachItem.name}
              className="image"
            />
            <p className="heading">{eachItem.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
      />
      <div>
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button type="button" onClick={this.onClickRetryButton}>
          Retry
        </button>
      </div>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#e6ffff" height="50" width="50" />
    </div>
  )

  render() {
    const {optionSelected} = this.state
    console.log(optionSelected)

    return (
      <div>
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </nav>
        <div className="select-container">
          <select onChange={this.onChangeOption} className="select-cont">
            {categoriesList.map(eachItem => (
              <option key={eachItem.id} value={eachItem.id}>
                {eachItem.displayText}
              </option>
            ))}
          </select>
          {this.renderProjectsBasedOnApi()}
        </div>
      </div>
    )
  }
}

export default App
