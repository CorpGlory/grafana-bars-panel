import { MetricsPanelCtrl } from 'grafana/app/plugins/sdk';
import { appEvents } from 'grafana/app/core/core';

import * as _ from 'lodash';


class Ctrl extends MetricsPanelCtrl {

  static templateUrl = "partials/template.html";

  private _panelContent: HTMLElement;
  private _graphHolder: HTMLElement;

  private _seriesList: any;

  private _showNoData: boolean = false;

  constructor($scope, $injector) {
    super($scope, $injector);

    this.events.on('init-edit-mode', this._onInitEditMode.bind(this));
    this.events.on('data-received', this._onDataReceived.bind(this));
    this.events.on('render', this._onRender.bind(this));

    this._showNoData = false;

  }

  link(scope, element) {
    this._panelContent = element.find('.panel-content')[0] as HTMLElement;
    this._graphHolder = element.find('.graphHolder')[0] as HTMLElement;
    this._initCrosshairEvents();
  }

  private _initCrosshairEvents() {
    appEvents.on('graph-hover', event => {
      var isThis = event.panel.id === this.panel.id;
      if(!isThis) {
        if(!this.dashboard.sharedTooltipModeEnabled()) {
          return;
        }
        if(this.otherPanelInFullscreenMode()) {
          return;
        }
      }
      if(!isThis && this.dashboard.sharedCrosshairModeOnly()) {
        return;
      } else {
        return;
      }
    }, this.$scope);

    appEvents.on('graph-hover-clear', (event, info) => {
    }, this.$scope);


  }


  private _onRender() {
    console.log('this.$scope.showNoData:' + (this._showNoData));
    this._graphHolder.style.height = this._panelContent.style.height = this.height + 'px';
    if(this._showNoData) {
      return;
    }
  }

  private _updateGraphData() {
    console.log('_updateGraphData');
  }

  private _onDataReceived(seriesList: any) {
    if(seriesList === undefined || seriesList.length === 0) {
      this._showNoData = true;
    } else {
      this._showNoData = false;
    }
    this._seriesList = seriesList;
    if(!this._showNoData) {
      this._updateGraphData();
    }
    this.render();
  }

  private _onInitEditMode() {
  }

}


export { Ctrl as PanelCtrl }
