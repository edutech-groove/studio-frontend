import React from 'react';
import PropTypes from 'prop-types';
import { SearchField } from '@edx/paragon';

import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import messages from './displayMessages';
import './AssetsSearch.scss';

export default class AssetsSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.assetsSearch.search };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.assetsSearch.search) {
      this.setState({ value: nextProps.assetsSearch.search });
    }
  }

  submit = (e) => {
    e.preventDefault();
    this.props.updateSearch(this.state.value, this.props.courseDetails);
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  }

  handleClear = () => {
    // relying on `submit` introduces as state update race
    // condition
    this.props.updateSearch('', this.props.courseDetails);
  }

  render() {
    return (
      <form className="form-search" onSubmit={this.submit}>
        <input className="search-input" type="text" placeholder="Search" onChange={this.handleChange} value={this.state.value}/>
        <button className="search-button" type="submit">
          <svg width="18" height="18" dangerouslySetInnerHTML={{__html: '<use xlink:href="#magnifying-glass"/>' }}/>
        </button>
      </form>
    );
  }
}


AssetsSearch.propTypes = {
  assetsSearch: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  courseDetails: PropTypes.shape({
    lang: PropTypes.string,
    url_name: PropTypes.string,
    name: PropTypes.string,
    display_course_number: PropTypes.string,
    num: PropTypes.string,
    org: PropTypes.string,
    id: PropTypes.string,
    revision: PropTypes.string,
    base_url: PropTypes.string,
  }).isRequired,
  updateSearch: PropTypes.func.isRequired,
};
