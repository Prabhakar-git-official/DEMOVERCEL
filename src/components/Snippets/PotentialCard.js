import React from 'react';
import { Card } from 'react-bootstrap';

const PotentialCard = (props) => {
    return (
        <Card className='card-potential'>
            <Card.Body>
                <h5 className='text-gray text-uppercase'>{props.title}</h5>
                <img src={props.icon} alt="icon" />
                <p className="h3" style={{color:"white"}}>{props.text}</p>
                {props.comingSoon && <h5 className='text-gray text-normal text-uppercase'>coming Soon</h5>}
            </Card.Body>
        </Card>
    );
};

export default PotentialCard;