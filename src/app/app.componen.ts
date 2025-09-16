import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    template: `<router-outlet></router-outlet>`, // This is where the routed components will be displayed
    styleUrls: ['./app.component.scss']
})
export class AppComponent { }