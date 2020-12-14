import React from 'react';
import './skeleton.css';

const Skeleton = () => {
    return (
        <div className="skeleton">
            <div className="image"></div>
            <div className="text">
                <span className="author"></span>
                <span className="desc"></span>
            </div>
        </div>
    );
};

export default Skeleton;