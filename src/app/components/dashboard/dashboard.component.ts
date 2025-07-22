import { Component } from '@angular/core';
import { ChartOptions, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  barChartOptions: ChartOptions = {
    responsive: true,
  };

  barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      { label: 'New Members', data: [30, 50, 70, 40] },
      { label: 'Renewals', data: [10, 20, 30, 15] }
    ]
  };

  barChartType: ChartType = 'bar';
}