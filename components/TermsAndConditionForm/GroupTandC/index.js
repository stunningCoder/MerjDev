import React from 'react';
import PropTypes from 'prop-types';
import FIELDS from './fields';
import styles from '../styles.scss';
import Router from 'next/router';
import Button from '../../Button';
import FileDownloads from '../FileDownloads';
import * as APIHelper from '../../../utils/APIHelper';

export default class EntityTandC extends React.Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.handleCheckBoxClick = this.handleCheckBoxClick.bind(this);
        this.setIsSubmitted = this.setIsSubmitted.bind(this);
        this.setIsLoading = this.setIsLoading.bind(this);

        this.state = {
            isSubmitted: false,
            Files: [],
            marketing: true
        };
    }

    static propTypes = {
        formType: PropTypes.string,
        isReadOnly: PropTypes.bool
    };

    componentDidMount() {
        APIHelper.GetConfig().then((app) => {
            this.setState({ Files: app.Files, hasProspectus: app.HasProspectus });
        });
    }

    handleCheckBoxClick() {
        const { marketing } = this.state;
        this.setState({
            marketing: !marketing
        })
    }
    onSubmit() {
        const { marketing } = this.state;
        this.setIsLoading(true);
        APIHelper.UpdateLegalTandCs("1", marketing).then((res) => {
            if (res) {
                this.setIsLoading(false);
                this.setIsSubmitted(true);
                window.location.assign('/documents-upload');
            }
        })
    }
    setIsLoading(isLoading) {
        this.setState({
            isLoading,
        });
    }
    setIsSubmitted(isSubmitted) {
        this.setState({
            isSubmitted,
        });
    }

    render() {
        const { marketing, Files, hasProspectus } = this.state;
        const { formType, isReadOnly } = this.props;

        const componentForm = isReadOnly ?
            (<div><FileDownloads files={Files} /></div>) :
            (
                <div>
                    <form ref={this.form} onSubmit={e => e.preventDefault()} >
                        {

                            FIELDS(formType).map((field) => {

                                var renderField = true;

                                if (field.name === "prospectus" && !hasProspectus) {

                                    renderField = false;
                                }

                                if (renderField) {

                                    return (
                                        <div key={field.name}>
                                            <div className={styles.legalPanelTitle}>{field.label.toUpperCase()}</div>
                                            <div className={styles.legalPanelDetails} dangerouslySetInnerHTML={{ __html: field.description }} />
                                            <br />
                                        </div>
                                    );
                                } else {
                                    return null;
                                }
                            })
                        }
                    </form>
                    {
                        <div>
                            <div><input type='checkbox' checked={marketing} onChange={() => this.handleCheckBoxClick()} />I would like to receive emails regarding new product and services.</div>
                            <div><Button handleClick={this.onSubmit}>I Agree</Button></div>
                        </div>
                    }
                </div>
            );
        return (
            <div>
                {componentForm}
            </div>
        );
    }
}