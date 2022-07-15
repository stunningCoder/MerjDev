import React from 'react';
import Link from 'next/link';

import PropTypes from 'prop-types';

import { dom } from '../../utils';
import styles from './styles.scss';
import helpers from '../../static/styles/helpers.scss';
import Router from 'next/router';
import Nav from './Nav';
import DocumentsSection from './DocumentsSection';

export default class PageTabs extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);
    this.handleActiveSection = this.handleActiveSection.bind(this);
    this.setActiveSectionID = this.setActiveSectionID.bind(this);
    this.handleAsideFixing = this.handleAsideFixing.bind(this);
    this.setAsideIsFixed = this.setAsideIsFixed.bind(this);
    this.setAsideIsAbsolute = this.setAsideIsAbsolute.bind(this);
    this.onSectionClick = this.onSectionClick.bind(this);
    this.scrollToElement = this.scrollToElement.bind(this);

    this.padding = 16;
    this.headingHeight = 42; // FIXME: self-measured - calculate on the fly
    this.mobile = 799; // mobile screen
    this.desktop = 800; //desktop

    const { sections } = this.props;

    const activeSectionURL = sections.filter((section) => {
      if(section && section.url) {
        return window.location.pathname.includes(section.url);
      } 
    })[0];
    this.state = {
      activeSectionID: activeSectionURL && activeSectionURL.id ? activeSectionURL.id : sections[0].id,
      asideIsFixed: null,
      asideIsAbsolute: null,
    };
  }

  static propTypes = {
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        content: PropTypes.node,
        documents: PropTypes.arrayOf(
          PropTypes.shape({ title: PropTypes.string, href: PropTypes.string }),
        ),
        url: PropTypes.string,
        activeURL: PropTypes.string,
      }),
    ).isRequired,
    pageTitle: PropTypes.string
  };

  static defaultProps = {};

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const { innerWidth } = window;
    //desktop
    if (innerWidth >= this.desktop) {
      // Only fix aside on desktop
      this.handleAsideFixing();
    }

    this.handleActiveSection();
  }

  handleActiveSection() {
    const headerHeight = dom.getElementRect('header').height;
    let topPosition = headerHeight + this.padding * 3;
    const { innerWidth } = window;

    //mobile
    if (innerWidth <= this.mobile) {
      // Below 996px, the nav is fixed below the header so lets account for that too
      const navHeight = dom.getElementRect('nav-inner').height;

      topPosition += navHeight;
    }

    const pageSections = [...document.getElementsByClassName('page-section')];
    let activeSectionID = pageSections[0].id;

    pageSections.forEach((section) => {
      const sectionTop = dom.getElementRect(section.id).top;

      // When a section crosses the top position, it is active
      if (sectionTop <= topPosition) {
        activeSectionID = section.id;
      }
    });

    this.setActiveSectionID(activeSectionID);
  }

  setActiveSectionID(activeSectionID) {
    this.setState({
      activeSectionID,
    });
  }

  handleAsideFixing() {
    const pageRect = dom.getElementRect('page');
    const headerHeight = dom.getElementRect('header').height;
    const navHeight = dom.getElementRect('nav').height;
    const pageTop = pageRect.top;
    const topSpacing = headerHeight + this.padding;
    const pageBottom = pageRect.bottom;

    if (pageTop <= topSpacing) {
      if (pageBottom <= navHeight + topSpacing + this.padding) {
        // Absolute position
        this.setAsideIsAbsolute(this.padding);
        this.setAsideIsFixed(null);
      } else {
        // Fixed position
        this.setAsideIsFixed(topSpacing);
        this.setAsideIsAbsolute(false);
      }
    } else {
      // Static position
      this.setAsideIsFixed(null);
    }
  }

  getElementRect(elementID) {
    const element = document.getElementById(elementID);
    const rect = element && element.getBoundingClientRect();

    return rect;
  }

  setAsideIsFixed(asideIsFixed) {
    this.setState({
      asideIsFixed,
    });
  }

  setAsideIsAbsolute(asideIsAbsolute) {
    this.setState({
      asideIsAbsolute,
    });
  }
  navigateToPage = (url) => {
    Router.replace(url);
  }

  onSectionClick(sectionID) {
    const { sections } = this.props;
    const activeSection = sections.filter((section) => section.id === sectionID)[0];
    if (activeSection.url) {
      this.navigateToPage(activeSection.url);
    } else {
      this.scrollToElement(sectionID);
    }
  }

  scrollToElement(elementID) {
    this.setActiveSectionID(elementID);

    if (this.props.JumbotronHeight) {
      window.scrollTo({ top: this.props.JumbotronHeight, behavior: 'smooth' });
    }
  }

  render() {
    const { activeSectionID, asideIsFixed, asideIsAbsolute } = this.state;
    const { sections } = this.props;
    const fixedClassNames = asideIsFixed ? styles.fixed : null;
    const navClassNames = `${styles.navContainer} ${fixedClassNames}`;
    const documentsClassNames = `${styles.documentsContainer} ${fixedClassNames}`;
    const asideStyles = {
      position: asideIsFixed ? 'fixed' : asideIsAbsolute ? 'absolute' : 'absolute',
      top: asideIsFixed && asideIsFixed,
      bottom: asideIsAbsolute && asideIsAbsolute,
    };
    const activeSection = sections.filter((section) => section.id === activeSectionID)[0];
    const documentsComponent = activeSection.documents.length ? (
      <DocumentsSection title={activeSection.title} documents={activeSection.documents} />
    ) : null;
    return (
      <section id="page" className={styles.Page}>
        <div id="nav" className={navClassNames} style={asideStyles}>
          <Nav
            sections={sections}
            activeSectionID={activeSectionID}
            handleClick={this.onSectionClick}
          />
        </div>
        <div className={styles.pageTabPadInner}>
          <div className={styles.pageTabsContentContainer}>
            <div className={styles.pageTitle}>
              <h3>{this.props.pageTitle}</h3>
            </div>
            <div id={activeSection.id} className='page-section'>
              {activeSection.content}
            </div>
          </div>
        </div>
        <div id="documents" className={documentsClassNames} style={asideStyles}>
          {documentsComponent}
        </div>
      </section>
    );
  }
}
