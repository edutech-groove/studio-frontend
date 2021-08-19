import React from 'react';
import PropTypes from 'prop-types';
import { StatusAlert } from '@edx/paragon';
import { FormattedNumber } from 'react-intl';

import { assetActions } from '../../data/constants/actionTypes';
import WrappedMessage from '../../utils/i18n/formattedMessageWrapper';
import messages from './displayMessages';

const defaultState = {
  statusAlertFields: {
    alertDialog: '',
    alertType: 'info',
  },
  statusAlertOpen: false,
  uploadSuccessCount: 1,
};

export default class AssetsStatusAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;

    this.statusAlertRef = {};

    this.closeStatusAlert = this.closeStatusAlert.bind(this);
    this.updateStatusAlertFields = this.updateStatusAlertFields.bind(this);
    this.updateUploadSuccessCount = this.updateUploadSuccessCount.bind(this);

    this.closeDeleteStatus = this.closeDeleteStatus.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { assetsStatus, deletedAsset } = nextProps;
    this.updateStatusAlertFields(assetsStatus, deletedAsset);
  }

  updateStatusAlertFields(assetsStatus, deletedAsset) {
    const assetName = deletedAsset.display_name;
    let alertDialog;
    let alertType;

    const genericUpdateError = (
      <WrappedMessage
        message={messages.assetsStatusAlertGenericUpdateError}
      />
    );

    switch (assetsStatus.type) {
      case assetActions.delete.DELETE_ASSET_FAILURE:
        alertDialog = (
          <WrappedMessage
            message={messages.assetsStatusAlertCantDelete}
            values={{ assetName }}
          />
        );
        alertType = 'danger';
        break;
      case assetActions.delete.DELETE_ASSET_SUCCESS:
        alertDialog = (
          <WrappedMessage
            message={messages.assetsStatusAlertDeleteSuccess}
            values={{ assetName }}
          />
        );
        alertType = 'success';
        break;
      case assetActions.upload.UPLOAD_ASSET_SUCCESS:
        this.updateUploadSuccessCount();
        alertDialog = (
          <WrappedMessage
            message={messages.assetsStatusAlertUploadSuccess}
            values={{ uploaded_count: (<FormattedNumber value={this.state.uploadSuccessCount} />) }}
          />
        );
        alertType = 'success';
        break;
      case assetActions.upload.UPLOADING_ASSETS:
        this.closeStatusAlert();
        alertDialog = (
          <WrappedMessage
            message={messages.assetsStatusAlertUploadInProgress}
            values={{ uploading_count: (<FormattedNumber value={assetsStatus.count} />) }}
          />
        );
        alertType = 'info';
        break;
      case assetActions.upload.UPLOAD_EXCEED_MAX_COUNT_ERROR:
        alertDialog = (
          <WrappedMessage
            message={messages.assetsStatusAlertTooManyFiles}
            values={{ max_count: (<FormattedNumber value={assetsStatus.maxFileCount} />) }}
          />
        );
        alertType = 'danger';
        break;
      case assetActions.upload.UPLOAD_EXCEED_MAX_SIZE_ERROR:
        alertDialog = (
          <WrappedMessage
            message={messages.assetsStatusAlertTooMuchData}
            values={{ max_size: (<FormattedNumber value={assetsStatus.maxFileSizeMB} />) }}
          />
        );
        alertType = 'danger';
        break;
      case assetActions.upload.UPLOAD_ASSET_FAILURE:
        alertDialog = (
          <WrappedMessage
            message={messages.assetsStatusAlertGenericError}
            values={{ assetName: assetsStatus.asset.name }}
          />
        );
        alertType = 'danger';
        break;
      case assetActions.lock.TOGGLING_LOCK_ASSET_FAILURE:
        alertDialog = (
          <WrappedMessage
            message={messages.assetsStatusAlertFailedLock}
            values={{ assetName: assetsStatus.asset.name }}
          />
        );
        alertType = 'danger';
        break;
      case assetActions.clear.CLEAR_FILTERS_FAILURE:
      case assetActions.filter.FILTER_UPDATE_FAILURE:
      case assetActions.paginate.PAGE_UPDATE_FAILURE:
      case assetActions.sort.SORT_UPDATE_FAILURE:
        alertDialog = genericUpdateError;
        alertType = 'danger';
        break;
      default:
        return;
    }

    this.setState({
      statusAlertOpen: true,
      statusAlertFields: {
        alertDialog,
        alertType,
      },
    });
  }

  closeDeleteStatus = () => {
    this.closeStatusAlert();
    this.props.onDeleteStatusAlertClose();
  }

  closeStatusAlert() {
    this.props.clearAssetsStatus();

    // clear out all status related state
    this.setState(defaultState);
  }

  updateUploadSuccessCount() {
    this.setState({
      uploadSuccessCount: this.state.uploadSuccessCount + 1,
    });
  }

  render() {
    const { assetsStatus, statusAlertRef } = this.props;
    const { statusAlertFields, statusAlertOpen } = this.state;

    let onClose = this.closeStatusAlert;
    if (Object.prototype.hasOwnProperty.call(assetActions.delete, assetsStatus.type)) {
      onClose = this.closeDeleteStatus;
    }

    return (
        statusAlertOpen ? 
        <div className={`alert alert-${statusAlertFields.alertType}`} role="alert" >
          <button aria-label="Close" className="btn close" type="button" onClick={onClose}>
            <span aria-hidden="true">&times;</span>
          </button>
          <span className="icon icon-alert">
            {
              statusAlertFields.alertType==='success' ?
              <svg width="14.235" height="10.237" dangerouslySetInnerHTML={{__html: '<use xlink:href="#check-icon"/>' }}/> :
              statusAlertFields.alertType==='danger' ?
              <svg width="512" height="512" dangerouslySetInnerHTML={{__html: '<use xlink:href="#ban-icon"/>' }}/> :
              statusAlertFields.alertType==='info' ?
              <svg width="32" height="32" dangerouslySetInnerHTML={{__html: '<use xlink:href="#user-icon"/>' }}/> : ""
            }
          </span>
          <div className="message-content">Error notification unde omnis iste natus error sit voluptatem accusantium laudantium.</div>
        </div>
        : ""
      
    );
  }
}

AssetsStatusAlert.propTypes = {
  assetsStatus: PropTypes.shape({
    response: PropTypes.object,
    type: PropTypes.string,
  }).isRequired,
  clearAssetsStatus: PropTypes.func.isRequired,
  deletedAsset: PropTypes.shape({
    display_name: PropTypes.string,
    content_type: PropTypes.string,
    url: PropTypes.string,
    date_added: PropTypes.string,
    id: PropTypes.string,
    portable_url: PropTypes.string,
    thumbnail: PropTypes.string,
    external_url: PropTypes.string,
  }),
  onDeleteStatusAlertClose: PropTypes.func.isRequired,
  statusAlertRef: PropTypes.func,
};

AssetsStatusAlert.defaultProps = {
  assetsStatus: {},
  deletedAsset: {},
  statusAlertRef: () => {},
};
