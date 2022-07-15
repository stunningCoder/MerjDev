import React, { Component } from 'react';

import SECTIONS from '../../../../layouts/exchange/market/listings/sections';
import helpers from '../../../../static/styles/helpers.scss';

import Header from '../../../../components/Header';
import Page from '../../../../components/Page';
import Footer from '../../../../components/Footer';
import LargeSpringboard from '../../../../components/LargeSpringboard';
import Springboard from '../../../../components/Springboard';

import ExchangeSection from '../../../../layouts/exchange/market/listings/ExchangeSection';

export class MarketSummary extends Component {
  render() {
    return (
        <main>
          <div >
            <ExchangeSection />
          </div>

          {/* <Page sections={SECTIONS} /> */}

          <LargeSpringboard />

          <div className={helpers.springboardsSibebySide}>
            <Springboard
              title="Equities"
              subtitle="Learn more about the Equities Market"
              href="/exchange/market/equities"
              buttonText="Equities"
            />

            <Springboard
              title="Debt"
              subtitle="Learn more about the Debt Market"
              href="/exchange/market/debt"
              buttonText="Debt"
            />
          </div>
      
        </main>

    );
  }
}

export default MarketSummary;
