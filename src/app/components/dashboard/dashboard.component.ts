import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartData, ChartType } from 'chart.js';
import { DashboardService, DashboardStats } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  viewType: 'monthly' | 'quarterly' = 'monthly';

  totalMembers = 0;
  activePlans = 0;
  totalRevenue = 0;

  selectedYear = new Date().getFullYear();
  availableYears = [2022, 2023, 2024, 2025]; // or generate dynamically

  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { font: { size: 12 } } },
      y: { beginAtZero: true, ticks: { font: { size: 12 } } }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 14 } }
      },
      title: {
        display: true,
        text: '',
        font: { size: 16 }
      }
    }
  };

  barChartType: ChartType = 'bar';
  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.loadSummary();
    this.updateChartData();
  }

  loadSummary() {
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.totalMembers = data.totalMembers;
        this.activePlans = data.activePlans;
        this.totalRevenue = data.totalRevenue;
      },
      error: (err) => {
        console.error('Failed to load summary', err);
      }
    });
  }

  updateChartData() {
    const title = this.viewType === 'monthly'
      ? `Monthly Member Stats (${this.selectedYear})`
      : `Quarterly Member Stats (${this.selectedYear})`;

    this.barChartOptions.plugins!.title!.text = title;

    this.dashboardService.getStats(this.viewType, this.selectedYear).subscribe({
      next: (data: DashboardStats) => {
        this.barChartData = {
          labels: data.labels,
          datasets: [
            {
              label: 'New Members',
              data: data.newMembers,
              backgroundColor: 'rgba(63, 81, 181, 0.6)'
            },
            {
              label: 'Renewals',
              data: data.renewals,
              backgroundColor: 'rgba(0, 150, 136, 0.6)'
            }
          ]
        };
      },
      error: (err) => {
        console.error('Failed to load chart data', err);
      }
    });
  }
}