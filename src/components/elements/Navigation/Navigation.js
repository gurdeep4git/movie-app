import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

const Navigation = props => {
    const a = props;
    console.log(a);
    return (
        <div className="rmdb-navigation">
            <div className="rmdb-navigation-content">
                <Link to="/">
                    <p>Home</p>
                </Link>
                <p>/</p>
                <p>{props.movie}</p>
            </div>
        </div>
    );
};

export default Navigation;
