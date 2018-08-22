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

// Widgets[Dashboard.name] = Dashboard;
Widgets[NumberWidget.name] = NumberWidget;
Widgets[PingWidget.name] = PingWidget;
Widgets[BuildStatusWidget.name] = BuildStatusWidget;
Widgets[SparklineWidget.name] = SparklineWidget;
Widgets[ProgressWidget.name] = ProgressWidget;
Widgets[MultipleProgressWidget.name] = MultipleProgressWidget;
// Widgets[HistogramWidget.name] = HistogramWidget;
// Widgets[SplinegraphWidget.name] = SplinegraphWidget;
Widgets[GraphWidget.name] = GraphWidget;
Widgets[DashboardWidgetCollection.name] = DashboardWidgetCollection;
Widgets[DashboardJobScheduler.name] = DashboardJobScheduler;
/*
// Widgets[DashboardToolbar.name] = DashboardToolbar;
// Widgets[DashboardToolbarButton.name] = DashboardToolbarButton;
// Widgets[DashboardWidgetSelector.name] = DashboardWidgetSelector;
*/

export default Widgets;
