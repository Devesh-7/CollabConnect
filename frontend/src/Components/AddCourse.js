import React from 'react'
import './AddCourse.css'

const AddCourse = () => {
    return (
        <>
            <div className='coursecard'>
                <div class="courseimage">
                    <button class="imageaddbtn">+</button>
                </div>
                <div>
                    <div className="title">
                        <div className="title_asker">Title:</div>
                        <input className="title_holder"></input>
                    </div>
                    <div className="description">
                        <div className="title_asker">Description:</div>
                        <input className="title_holder"></input>
                    </div>
                    <div className="title">
                        <div className="title_asker">Tags:</div>
                        <input className="title_holder"></input>
                    </div>
                    <div className="title">
                        <div className="title_asker">URL:</div>
                        <input className="title_holder"></input>
                    </div>
                </div>
                <button className='uploadbtn'>Upload</button>

            </div>
        </>

    )
};

export default AddCourse;