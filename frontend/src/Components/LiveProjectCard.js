import './LiveProjectCard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from "@fortawesome/free-solid-svg-icons";
function LiveProjectCard(){
return(
    <div className="project_card_div">
    <div className="upper_div_card">
    <div className="card_left_upper"> 
    <div className="project_short_form">Ui</div>
    </div>
    
    <div className="project_card_right_holder">
      
      
      <div className="top_right_div">
       <FontAwesomeIcon icon={faCircle} className="dot"/><div className="live_status">Live</div>  
       <div className="project_no_of_likes">1.7k</div> 
       <div className="project_likebtn_div">
      
       </div>
       </div>
       
       <div className="project_name_div">
         <div className="project_name">User</div>
         <div className="project_name">Interface.</div>
         
       </div>
       <hr className="line_for_requirement"></hr>
       <div className="skills_required">
         <span className="skills_requirement_word">{`Requirements: `}</span>
         <span className="skills_name">Figma</span>
       </div>
       </div>
    </div>
    <div className="card_bottom_div" >
    <div
      className="credit_coin_symbol"
      
   
    />
    <div className="required_credits">25</div>
      <button className="project_view_btn"><p className="view">View</p></button></div>
  </div>
)

}
export default LiveProjectCard;