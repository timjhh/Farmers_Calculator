import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { BsBoxArrowUpRight } from "react-icons/bs";

function ExternalLink(props) {


	return (

    <>
      <Row className="my-2 d-flex w-100">

        <Col xs={props.link ? 11 : 12} className="d-flex justify-content-start">
          <p>
          {props.label}
          </p>
        </Col>
        <Col xs={props.link ? 1 : 0} className="justify-content-end">
          {props.link &&
          <a className="mx-auto" target="_blank" rel="noreferrer" href={props.link}>
             <BsBoxArrowUpRight />
          </a>
          }

        </Col>
      </Row>
      <hr className="mx-auto w-75" />
    </>


		)
}

export default ExternalLink;
