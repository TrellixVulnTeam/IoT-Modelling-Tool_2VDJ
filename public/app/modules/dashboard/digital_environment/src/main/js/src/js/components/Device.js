
import DeviceStore from "../stores/DeviceStore";
import FlatButton from 'material-ui/FlatButton';
import React, { Component, PropTypes, SyntheticEvent } from 'react';
import ItemTypes from '../dnd/ItemTypes';
import { DragSource } from 'react-dnd';
import * as DropActions from '../actions/DropActions';
import MenuItem from 'material-ui/MenuItem';
import { ListItem } from 'material-ui/List';
import * as utils from '../utils/utils';
import Avatar from 'material-ui/Avatar';


const boxSource = {
  beginDrag(props) {
    const { id, left, top, type, isPaletteItem } = props;
    return { id, left, top, type, isPaletteItem };
  }
};


class Device extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDevice: false,
      open: false,
      openSetProperty: false,
      selectValues: [],
      textValue: ""
    };
  }

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    hideSourceOnDrag: PropTypes.bool.isRequired,
    children: PropTypes.node
  };

  componentWillMount() {
    DeviceStore.on("change", this.getSelectedDevice);
  }

  componentWillUnmount() {
    DeviceStore.removeListener("change", this.getSelectedDevice);
  }

    /**
     * OVERWRITE screenshot of DragPreview from HTML5 here
     */
  componentDidMount() {
      const { connectDragPreview } = this.props;

      let parentClasses = utils.getParentClasses(this.props.type);
      if (parentClasses.includes("ssn:SensingDevice")) {
          const img = new Image();
          img.src = "https://storage.googleapis.com/gweb-uniblog-publish-prod/static/blog/images/google-200x200.7714256da16f.png";
          img.onload = () => connectDragPreview(img);
      }
      // Icons to be rendered in components
      var deviceIcon;
      var sensorIcon;
      var actuatorIcon;
      this.deviceIcon = localStorage.getItem('-KmO9pKQmrM-qMmXYk36');
      this.sensorIcon = localStorage.getItem('-KmOBotz19i_OxIOOY8A');
      this.actuatorIcon = localStorage.getItem('-KmOBuxbEHErqHYaPwvn');
  }


  handleRequestClose = () => {
    this.setState({
      open: false,
      anchorEl: null
    });
  };

  // if device was selected, delete selection
  // and delete device from store
  deleteDevice = () => {
    if (this.state.selectedDevice == this.props.id)
      DropActions.selectDevice("");

    DropActions.deleteDevice(this.props.id);
  };

  getSelectedDevice = () => {
    this.setState({
      selectedDevice: DeviceStore.getSelectedDevice()
    });
  };

  selectDeviceOptions = (e) => {
    e.preventDefault();

    this.setState({
      open: true,
      anchorEl: e.currentTarget,
    });
  };


  handleOpenSetProperty = () => {
   this.setState({openSetProperty: true});
  };

  handleCloseSetProperty = () => {
    this.setState({openSetProperty: false});
  };


  handleKeysDevice = (e) => {
    var key = e.keyCode || e.charCode || 0;

    if (key == 46) {
      this.deleteDevice();
      document.body.removeEventListener('keyup', this.handleKeysDevice);
    }
  };

  handleClick = (e) => {
    e.stopPropagation();

    if (DeviceStore.getSelectedDevice() == this.props.id)
      DropActions.selectDevice("");
    else
      DropActions.selectDevice(this.props.id);
  };

  handleChange = (event, index, selectValues) => {
    // this.state.attributeInputs[name] = "";
    this.setState({selectValues});
  };

  menuItems(selectValues) {

    if (!this.props.isPaletteItem) {
      // var names = DeviceStore.getPossiblePropertiesOfDevice(this.props.type);

      var names = DeviceStore.getPossibleProperties(this.props.type);

      return names.map((name) => (
        <MenuItem
          key={name}
          insetChildren={true}
          checked={selectValues && selectValues.includes(name)}
          value={name}
          primaryText={name}
        />
      ));
    }
  }



  render() {
    const { hideSourceOnDrag, left, top, type, connectDragSource, isDragging, children, id, isPaletteItem, key } = this.props;

      let iconDevice =  this.deviceIcon;
      let iconSensor = this.sensorIcon;
      let iconActuator = this.actuatorIcon;

      let sensingDeviceAvatar = undefined;
      let deviceAvatar = undefined;
      let actuatingDeviceAvatar = undefined;

      let isDevice = false;
      let isSensingDevice = false;
      let isActuatingDevice = false;

      let parentClasses = utils.getParentClasses(this.props.type);
      if (parentClasses.includes("ssn:SensingDevice")) {
          sensingDeviceAvatar = (<Avatar src={iconSensor}/>);
          isSensingDevice = true;
      } else if(parentClasses.includes("ssn:Device") && !parentClasses.includes("iot-lite:ActuatingDevice")) {
          deviceAvatar = (<Avatar src={iconDevice}/>);
          isDevice = true;
      } else if(parentClasses.includes("iot-lite:ActuatingDevice")) {
          actuatingDeviceAvatar = (<Avatar src={iconActuator}/>);
          isActuatingDevice = true;
      }


    var backgroundColor;
    if (this.state.selectedDevice == id) {
      backgroundColor = "lightgreen";
    }
    else {
      backgroundColor = "white";
    }

    const style = {
      position: 'absolute',
      border: '1px ridge gray',
      backgroundColor: backgroundColor,
      padding: '0.5rem 1rem',
      cursor: 'move'
    };

    if (isDragging && hideSourceOnDrag) {
      return null;
    }


    const actionsSetProperty = [
      <FlatButton
        label="Cancel"
        onTouchTap={this.handleCloseSetProperty}
      />,
      <FlatButton
        label="Save"
        primary={true}
        onTouchTap={ () => {
          DropActions.setProperty(id, this.state.selectValues, this.state.textValue);
          this.handleCloseSetProperty();
        } }
      />
    ];



    if (this.state.selectedDevice == id) {
      document.body.addEventListener('keyup', this.handleKeysDevice);
    }
    else {
      document.body.removeEventListener('keyup', this.handleKeysDevice);
    }


    if (isPaletteItem && isSensingDevice) {
      return connectDragSource(
        <div>
          <ListItem key={key} primaryText={id}
                    leftAvatar={sensingDeviceAvatar}
                    style={{'border': '1px dotted gray', 'backgroundColor': '#ffe082'}}>
          </ListItem >
        </div>
      );
    } else if(isPaletteItem && isDevice) {
        return connectDragSource(
            <div>
              <ListItem key={key} primaryText={id}
                        leftAvatar={deviceAvatar}
                        style={{'border': '1px dotted gray', 'backgroundColor': '#aed581'}}>
              </ListItem >
            </div>
        );
    } else if(isPaletteItem && isActuatingDevice) {
        return connectDragSource(
            <div>
              <ListItem key={key} primaryText={id}
                        leftAvatar={actuatingDeviceAvatar}
                        style={{'border': '1px dotted gray', 'backgroundColor': '#4fc3f7'}}>
              </ListItem >
            </div>
        );
    }
    else {
      return connectDragSource (
        <div onClick={this.handleClick} onDoubleClick={this.handleOpenSetProperty} style={{ ...style, left, top }}>
          {id}
        </div>
      );
    }
  }
}



export default DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
      connectDragPreview: connect.dragPreview()})
)(Device);
