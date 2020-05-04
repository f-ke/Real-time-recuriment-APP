import React,{Component} from "react"
import {connect} from 'react-redux'
//message main client container
class Message extends Component {

    render() {
        return(
            <div>Boss</div>
        )
    }

}
export default connect(
    state=>({}),
    {}
)(Message)
