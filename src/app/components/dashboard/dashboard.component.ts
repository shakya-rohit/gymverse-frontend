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
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Monthly Member Stats',
        font: {
          size: 16
        }
      }
    }
  };


  barChartData: ChartData<'bar'> = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: 'New Members',
        data: [30, 50, 70, 40, 60, 55, 80, 75, 65, 90, 85, 95],
        backgroundColor: 'rgba(63, 81, 181, 0.6)'
      },
      {
        label: 'Renewals',
        data: [10, 20, 30, 15, 25, 35, 40, 38, 28, 50, 45, 55],
        backgroundColor: 'rgba(0, 150, 136, 0.6)'
      }
    ]
  };


  barChartType: ChartType = 'bar';
}