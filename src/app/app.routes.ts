import { Routes } from '@angular/router';
import {Home} from "./components/home/home";

const routes: Routes = [

    {path: ':language',component: Home},
    // {path: '**', pathMatch: 'full', redirectTo: '/'},

];

export default routes