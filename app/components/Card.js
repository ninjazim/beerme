import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import transition from 'styled-transition-group';
import axios from 'axios';

class Card extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      going: false,
    };
  }

  componentDidMount() {
     let attendees = this.props.bar.attendees;
     let userIsAttendee = attendees.filter((attendee) => {
       return attendee.username === this.props.user.username
     });
     if (userIsAttendee.length > 0) {
       this.setState({
         going: true,
         attendees: attendees,
         visible: true
       });
     } else {
       this.setState({
         going: false,
         attendees: attendees,
         visible: true
       });
     }
  }

  updateAttendance() {
    if (this.props.isLoggedIn) {
      console.log('updating attendance...');
      let postData = {
        businessId: this.props.bar.id,
        going: !this.state.going
      };
      axios.post(`/api/bars`, postData)
        .then(response => {
          let attendees = response.data.attendees;
          let userIsAttendee = attendees.filter((attendee) => {
            return attendee.username === this.props.user.username
          });
          if (userIsAttendee.length > 0) {
            this.setState({
              going: true,
              attendees
            });
          } else {
            this.setState({
              going: false,
              attendees
            });
          }
          this.props.updateAttendeeState(this.props.barIndex, attendees);
        })
        .catch(error => { console.log(error) });
    }
  }
  render() {
    const bar = this.props.bar;
    let attendees = this.state.attendees || [];
    let buttonText = this.state.going ? "😄 You're going!" : "🤔 Going here tonight?";
    let attendeeText = attendees.length == 0 ? '🤔 Going here tonight?' : (
      attendees.length == 1 && !this.state.going ? '😊 Someone is going' : (
      attendees.length == 1 && this.state.going ? `😎 You're going!` : (
      attendees.length == 2 && this.state.going ? `😄 You & someone else are going!` : (
      attendees.length > 2 && this.state.going ? `😍 You & others are going!` : (
      '🎉 Multiple people are going')))));
    let tooltipText = this.props.isLoggedIn ? "Let others know you're going!" : "Sign in to let others know you're going.";

    return (
      <FadeDiv in={this.state.visible} >
        <CardContainer delay={this.props.delay} visible={this.state.visible} fadeOut={this.props.isLoading}>
          <Image background={ bar.image_url } />
          <InnerContainer>
            <Name href={bar.url} title="View this bar on Yelp">{ bar.name }</Name>
            <Info>
              <Rating> { "⭐️".repeat(bar.rating) }</Rating>
              { bar.rating % 1 > 0 &&
                  <span>
                    <HalfRating>⭐️</HalfRating>
                    <RatingHalfer>{' '}</RatingHalfer>
                  </span>
              }
              { bar.rating % 1 == 0 &&
                <RatingSpacer>{' '}</RatingSpacer>
              }
              <Reviews>  { bar.review_count } Reviews</Reviews>
            </Info>
            <Info>
              { bar.price } •
              { bar.categories.map((category, i) => {
                if (i == bar.categories.length - 1) {
                  return <span key={i}> { category.title } </span>
                } else {
                  return <span key={i}> { category.title }, </span>
                }
              })}

            </Info>
            <AttendeeGroup>
                <GoingButton disabled={!this.props.isLoggedIn}
                             title={tooltipText}
                             going={this.state.going}
                             onClick={() => this.updateAttendance() }
                >
                  {attendeeText}
                </GoingButton>
            </AttendeeGroup>
          </InnerContainer>
        </CardContainer>
      </FadeDiv>
    );
  }
}

export default Card;

const FadeDiv = transition.div.attrs({
  unmountOnExit: true,
  timeout: 500
})`
  &:enter { opacity: 0.01; }
  &:enter-active {
    opacity: 1;
    transition: opacity 0.5s ease;
  }
  &:exit { opacity: 1; }
  &:exit-active {
    opacity: 0.01;
    transition: opacity 0.1s ease;
  }
`;

const CardContainer = styled.div`
  min-width: 800px;
  min-height: 200px;
  box-shadow: 0px 1px 5px 1px rgba(0,0,0,0.1);
  margin: 5px 20px;
  background: linear-gradient(#fafafa, #fefefe);
  color: #333;
  display: flex;
  flex: 1;
  flex-direction: row;
  border-radius: 5px;
  font-family: 'Open Sans', sans-serif;
  opacity: 1;
  transition: opacity 1s ease ${props => props.delay}s, width 0.5s ease, height 0.5s ease;

  @media (max-width: 840px) {
    min-width: 90vw;
  }

  @media (max-width: 640px) {
    flex-direction: column;
  }

  &:hover {
    background: #fefefe;
  }

  ${'' /* ${props => (props.visible == true && props.fadeOut == false) && css`
    opacity: 1;
  `}; */}

`;

const Image = styled.div`
  height: auto;
  flex: 0 1 200px;
  background: url(${props => props.background});
  background-position: center;
  background-size: cover;
  border-radius: 5px 0px 0px 5px;
`;

const InnerContainer = styled.div`
  flex: 1;
  padding: 20px;
`;

const Name = styled.a`
  font-size: 1.75rem;
  line-height: 2rem;
  font-weight: 400;
  padding: 0;
  margin: 0;
  transition: 0.5s;
  text-decoration: none;
  color: #333;

  ${CardContainer}:hover & {
    text-decoration: underline;
  }

  @media (max-width: 640px) {
    font-size: 1.5rem;
    line-height: 1.75rem;
  }
`;

const Rating = styled.span`
  letter-spacing: -4px;
  font-size: 1.15rem;
`;

const HalfRating = styled.span`
  letter-spacing: -4px;
  font-size: 1.15rem;
`;

const Reviews = styled.span`
  color: gray;
`;

const RatingHalfer = styled.span`
  background: white;
  margin-left: -9px;
  font-size: 1.15rem;
  padding: 0px 5px;
`;

const RatingSpacer = styled.span`
  background: white;
  margin-left: 0px;
  font-size: 1.15rem;
  padding: 0px 5px;
`;

const Info = styled.p`
  margin: 0;
  padding: 5px 0;
`;

const AttendeeGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const Attendees = styled.p`
  margin: 0;

`;

const GoingButton = styled.button`
  padding: 5px 10px;
  margin-right: 10px;
  border: 1px solid #396FB8;
  background: ${props =>
  (props.going == true && '#396FB8') || 'white'
  };
  border-radius: 2px;
  color: ${props =>
  (props.going == true && 'white') || '#396FB8'
  };
  font-size: 0.8rem;
  transition: 0.3s;

  &:hover {
    cursor: pointer;
    box-shadow: 0px 1px 3px 1px rgba(0,0,0,0.1);
    color: white;
    background: #396FB8;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    background: lightgray;
    opacity: 0.9;
    border-color: lightgray;
    cursor: not-allowed;
    color: white;

    &:hover {
      cursor: not-allowed;
    }

  }
`;
