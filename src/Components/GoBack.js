import React from 'react'

const GoBack = (props) => {
  return (
    <button type="button" 
      className="btn btn-light"
      onClick={props.props.history.length > 2 ? () => { props.props.history.goBack() } : null}>Go Back
    </button>
  )
}

export default GoBack