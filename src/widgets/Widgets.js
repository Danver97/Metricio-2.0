// import Dashboard from './dashboard';
import NumberWidget from './number/widget';
import PingWidget from './ping/widget';
import BuildStatusWidget from './build-status/widget';
import SparklineWidget from './sparkline/widget';
import ProgressWidget from './progress/widget';
import MultipleProgressWidget from './multiple-progress/widget';
import GraphWidget from './graph/widget';
import DashboardJobScheduler from './job-scheduler/widget';
// rst
// import HistogramWidget from './histogram/widget';
// import SplinegraphWidget from './splinegraph/widget';
// import DashboardToolbar from '../react-elements/dashboard-elements/toolbar/widget';
// import DashboardToolbarButton from '../react-elements/dashboard-elements/toolbar/button/widget';
// import DashboardToolbarMenuButton from './dashboard-elements/toolbar/menu-button/widget';
// import DashboardWidgetSelector from '../react-elements/dashboard-widget-selector/widget';
// rcl

import DashboardWidgetCollection from '../react-elements/dashboard-widget-collection/widget';

const Widgets = {};

// Widgets[Dashboard.className] = Dashboard;
Widgets[NumberWidget.className] = NumberWidget;
Widgets[PingWidget.className] = PingWidget;
Widgets[BuildStatusWidget.className] = BuildStatusWidget;
Widgets[SparklineWidget.className] = SparklineWidget;
Widgets[ProgressWidget.className] = ProgressWidget;
Widgets[MultipleProgressWidget.className] = MultipleProgressWidget;
// Widgets[HistogramWidget.className] = HistogramWidget;
// Widgets[SplinegraphWidget.className] = SplinegraphWidget;
Widgets[GraphWidget.className] = GraphWidget;
Widgets[DashboardWidgetCollection.className] = DashboardWidgetCollection;
Widgets[DashboardJobScheduler.className] = DashboardJobScheduler;
/*
// Widgets[DashboardToolbar.className] = DashboardToolbar;
// Widgets[DashboardToolbarButton.className] = DashboardToolbarButton;
// Widgets[DashboardWidgetSelector.className] = DashboardWidgetSelector;
*/

export default Widgets;
