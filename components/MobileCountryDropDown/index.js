import React from 'react';
import PropTypes from 'prop-types';
import * as APIHelper from '../../utils/APIHelper';
export default class MobileCountrySelect extends React.Component {
    constructor(props) {
        super(props);
        this.setInitialValue = this.setInitialValue.bind(this);
        this.state = {
            isLoading: true,
            options: [{Name: 'Please select country code', value: ''}]
        }
    }

    static propTypes = {
        value: PropTypes.string,
        handleChange: PropTypes.func,
        onInvalid: PropTypes.func,
        disabled: PropTypes.bool
    }
    static defaultProps = {};

    componentDidMount() {
        
        APIHelper.GetDropDownData().then((response) => {
            if (response) {
                this.setState({
                    options: response.Data.CountryList,
                    isLoading: false
                });
            }
        }).catch((err) => {
            return err;
        });

        const { value } = this.props;
        if (value !== '') {
            if (!value) {
                this.setInitialValue();
            }
        }
    }

    setInitialValue() {
        const { handleChange } = this.props;
        const { options } = this.state;

        const syntheticEvent = {
            target: {
                value: options[0],
            },
        };

        handleChange(syntheticEvent);
    }
    render() {
        const { options,isLoading } = this.state;
        const { value, handleChange, isRequired, disabled} = this.props;
    
        return (
            
          <select onInvalid={this.props.onInvalid} required={isRequired} value={value} onChange={handleChange} disabled={disabled}>
            <option value=''> {isLoading? "loading...":"Please select country code"}</option>
            {options.map((option) => {
                return (
                    <option key={option.Name} value={option.CountryDescription} >
                    {option.CountryDescription}
                    
                    </option>
                    );
                })}
          </select>
        );
      }
}