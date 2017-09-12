import fetch = require('isomorphic-fetch');
import Link from 'next/link';
import * as React from 'react';
import styled from 'styled-components';
import HeaderTop from './HeaderTop';
import { RightAlignedHeaderItem, RightAlignedHeaderItemLeft } from './styles';
import TopStreamersGraph from './TopStreamersGraph';
import TopStreamersInfopane from './TopStreamersInfopane';

const Nav = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid gray;
  margin-bottom: 5px;
`;

const StreamerAnchor = styled.a`
  padding: 0 5px 0 5px;
  border-bottom: ${props => (props.data === 'active' ? '1px black solid' : '')};
  font-size: 1.05em;
  font-weight: ${props => (props.data === 'active' ? 'bold' : '')};
  color: ${props => (props.data === 'active' ? '#3865ff' : '#686868;')};
  text-decoration: none;
`;

const PeriodAnchor = StreamerAnchor.extend`padding: auto;`;

const RightNav = RightAlignedHeaderItemLeft.extend`padding-left: 0px;`;

interface ITopStreamersState {
  streamers: Array<{ [key: string]: any }>;
  currentStreamer: { [key: string]: any };
  currentPeriod: string;
}

export default class TopStreamers extends React.Component<
  any,
  ITopStreamersState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentPeriod: 'week',
      currentStreamer: {},
      streamers: [{}],
    };
    this.setState = this.setState.bind(this);
    this.handlePeriodClick = this.handlePeriodClick.bind(this);
    this.handleStreamerClick = this.handleStreamerClick.bind(this);
  }

  public async getStreamers() {
    const response = await fetch(
      'http://localhost:3001/api/channels?sort=averageViewers,allTime,desc&limit=3',
    );
    const json = await response.json();
    return json;
  }

  public componentWillMount() {
    this.getStreamers().then(res => {
      this.setState({ streamers: res, currentStreamer: res[0] });
    });
  }

  public handlePeriodClick(e: React.SyntheticEvent<HTMLAnchorElement>) {
    e.preventDefault();
    this.setState({ currentPeriod: e.currentTarget.id });
  }

  public handleStreamerClick(e: React.SyntheticEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const index = parseInt(e.currentTarget.id.split('-')[1], 10);
    this.setState({ currentStreamer: this.state.streamers[index] });
  }

  public render() {
    return (
      <div>
        {/* Header bar */}
        <Nav>
          <RightNav>
            {this.state.streamers.map((streamer, index) => {
              if (streamer.averageViewers) {
                return (
                  <StreamerAnchor
                    id={`${streamer._id}-${index}`}
                    key={streamer._id}
                    href="#"
                    onClick={this.handleStreamerClick}
                    data={
                      this.state.currentStreamer === streamer
                        ? 'active'
                        : 'not-active'
                    }
                  >
                    {streamer.channelDisplayName}
                    {' - '}
                    {Math.round(streamer.averageViewers.allTime.value)}
                  </StreamerAnchor>
                );
              } else {
                return;
              }
            })}
          </RightNav>
          <RightAlignedHeaderItem>
            <PeriodAnchor
              id="day"
              href="#"
              onClick={this.handlePeriodClick}
              data={
                this.state.currentPeriod === 'day' ? 'active' : 'not-active'
              }
            >
              Day
            </PeriodAnchor>
            {' - '}
            <PeriodAnchor
              id="week"
              href="#"
              onClick={this.handlePeriodClick}
              data={
                this.state.currentPeriod === 'week' ? 'active' : 'not-active'
              }
            >
              Week
            </PeriodAnchor>
            {' - '}
            <PeriodAnchor
              id="month"
              href="#"
              onClick={this.handlePeriodClick}
              data={
                this.state.currentPeriod === 'month' ? 'active' : 'not-active'
              }
            >
              Month
            </PeriodAnchor>
            {' - '}
            <PeriodAnchor
              id="allTime"
              href="#"
              onClick={this.handlePeriodClick}
              data={
                this.state.currentPeriod === 'allTime' ? 'active' : 'not-active'
              }
            >
              All Time
            </PeriodAnchor>
          </RightAlignedHeaderItem>
        </Nav>
        <TopStreamersInfopane
          streamer={this.state.currentStreamer}
          period={this.state.currentPeriod}
        />
        <TopStreamersGraph />
      </div>
    );
  }
}