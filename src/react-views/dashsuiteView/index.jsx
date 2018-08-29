import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import '../../styles/default.scss';
import '../../styles/_button-shadow.scss';
import './styles.scss';

// import EditableText from '../../react-elements/editable-text'
import DefaultFrame from '../../react-elements/default-frame/widget';
import { getBoardsStruct } from '../../lib/titledTableStructures';
import { post } from '../../lib/requests';
import urlPaths, { addQuery } from '../../lib/url_paths';

const dashboardCreatePath = urlPaths.dashboard.get.create();

class Dashsuites extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalDelete: false,
    };
    this.dashsuite = this.props.match.params.dashsuite;
    this.dashsuiteDelete = this.dashsuiteDelete.bind(this);
    this.toggleModalDelete = this.toggleModalDelete.bind(this);
    // this.onModify = this.onModify.bind(this);
  }
  /*
  onModify(text) {
    console.log('modified! ' + text);
  }
  */
  getModalDelete() {
    return (
      <Modal 
        isOpen={this.state.modalDelete} 
        toggle={this.toggleModalDelete}
      >
        <ModalHeader className="modalheader" toggle={this.toggleModalDelete}>Confirm deletion</ModalHeader>
        <ModalBody className="modalbody">
          Are you sure to delete this dashsuite and all its dashboards?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.dashsuiteDelete}>{'I\'m sure'}</Button>{' '}
          <Button color="secondary" onClick={this.toggleModalDelete}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
  
  dashsuiteDelete() {
    post(urlPaths.dashsuites.post.delete(this.dashsuite), { 'Content-Type': 'application/x-www-form-urlencoded' }, {});
    this.toggleModalDelete();
    this.props.history.goBack();
  }
  
  toggleModalDelete() {
    const modalDelete = !this.state.modalDelete;
    this.setState({ modalDelete });
  }
  
  render() {
    console.log('dashsuiteView tree clear.');
    const createPath = addQuery(dashboardCreatePath, { dashsuite: this.dashsuite });
    return (
      <DefaultFrame history={this.props.history} titledTables={[getBoardsStruct(this.dashsuite, 'Add New', createPath)]} >
        <div className="dashsuitetitle">
          <h1 style={{ display: 'inline-block' }}>{this.dashsuite}</h1>
          <Button color="danger" onClick={this.toggleModalDelete}>Delete</Button>
          {this.getModalDelete()}
        </div>
      </DefaultFrame>
    );
  }
}

export default Dashsuites;
/*
        <h1 style={{ display: 'inline' }}>{this.dashsuite}</h1>
        <EditableText text={this.dashsuite} onConfirm={this.onModify} />
*/
