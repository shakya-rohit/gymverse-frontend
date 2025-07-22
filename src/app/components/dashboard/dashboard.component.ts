import { Component } from '@angular/core';
import { ChartOptions, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  viewType: 'monthly' | 'quarterly' = 'monthly';

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

  barChartType: ChartType = 'bar';
  barChartData: ChartData<'bar'> = this.getMonthlyData();

  selectedYear = new Date().getFullYear();
  availableYears = [2022, 2023, 2024, 2025]; // Can be dynamic

  updateChartData() {
    this.barChartOptions.plugins!.title!.text =
      this.viewType === 'monthly'
        ? `Monthly Member Stats (${this.selectedYear})`
        : `Quarterly Member Stats (${this.selectedYear})`;

    this.barChartData =
      this.viewType === 'monthly' ? this.getMonthlyData() : this.getQuarterlyData();
  }

  getMonthlyData(): ChartData<'bar'> {
    return {
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
  }

  getQuarterlyData(): ChartData<'bar'> {
    return {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'New Members',
          data: [150, 175, 220, 270],
          backgroundColor: 'rgba(63, 81, 181, 0.6)'
        },
        {
          label: 'Renewals',
          data: [60, 75, 106, 120],
          backgroundColor: 'rgba(0, 150, 136, 0.6)'
        }
      ]
    };
  }
}
