import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouteReuseStrategy, Router, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { NgCircleProgressModule } from 'ng-circle-progress';

import { environment } from '../environments/environment';
import { SharedModule } from './shared.module';
import { Platform } from '@ionic/angular';
import { StatusBarMock, SplashScreenMock, PlatformMock, NavMock } from 'test-config/ionic-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { UiService } from './ui.service';
import { RouterStub } from 'test-config/router.stub';
import { GameService } from './game.service';
import { IPlayer, Stat, ModeratorTier, Profession, Direction } from 'src/shared/interfaces';
import { RestrictedNumber } from 'restricted-number';
import { key } from 'localforage';
import { any } from 'async';
import { NullTemplateVisitor } from '@angular/compiler';

describe('App: AppTest', () => {
    const router = {
        navigate: jasmine.createSpy('navigate'),
    };
    const routes: Routes = [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
    ];
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                IonicModule.forRoot(),
                ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
                RouterTestingModule.withRoutes(routes),
                SharedModule,
                NgCircleProgressModule.forRoot(),
            ],
            /*
            providers: [
                { provide: Router, useClass: RouterStub },
                { provide: StatusBar, useClass: StatusBarMock },
                { provide: SplashScreen, useClass: SplashScreenMock },
                { provide: Platform, useClass: PlatformMock },
                { provide: NavController, useValue: NavMock }
            ],*/
            declarations: [AppComponent],
        }).compileComponents();
    }));

    it('Should create the app', () => {
        const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
        const component: AppComponent = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    it('Should render IdleLands title in a ion-title tag', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        expect(compiled.querySelector('ion-title').textContent).toContain('IdleLands');
    });

    it('Should check UiService authId on player', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const uiService = fixture.debugElement.injector.get(UiService);
        expect(uiService.isSettingsUnSynced(mockPlayer)).toEqual(false);
    });

    it('Should check GameService read player', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const gameService = fixture.debugElement.injector.get(GameService);
        gameService.setCurrentPlayer(mockPlayer);
        const app = fixture.debugElement.componentInstance;
        expect(app.player.name).toContain(mockPlayer.name);
    });

    it('Should render player name in the template', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const gameService = fixture.debugElement.injector.get(GameService);
        gameService.setCurrentPlayer(mockPlayer);
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('#playerTitle').textContent).toContain(mockPlayer.name);
    });
});

const mockPlayer: IPlayer = {
    _id: '5d8f6d13620f47765cc141db',
    authId: '3234232',
    authType: 'type',
    authSyncedTo: 'db',
    modTier: ModeratorTier.Admin,
    il3CharName: 'Majoo',
    name: 'Majoo',
    userId: '2ef17c34135200fa06cc8c35f1e4f6f81a633927-fc18-4fb1-9cd8-0364e2d9ff67',
    createdAt: 1569680659802,
    availableGenders: [
        'male',
        'female',
        'not a bear',
        'glowcloud',
        'astronomical entity',
        'soap'
    ],
    availableTitles: [
        'Newbie'
    ],
    level: new RestrictedNumber(1, 100, 38),
    xp: new RestrictedNumber(0, 20312, 66),
    profession: Profession.Generalist,
    gender: 'male',
    map: 'Norkos',
    x: 42,
    y: 67,
    ascensionLevel: 0,
    gold: 104956,
    stamina: new RestrictedNumber(0, 66, 66),
    buffWatches: null,
    cooldowns: {
        'Emeriss the Guardian': 1569687158610
    },
    discordTag: '',
    currentStats: {
        salvage: 0,
        'str': 180,
        'dex': 149,
        'int': 88,
        'con': 202,
        'agi': 68,
        'luk': 134,
        'hp': 1542,
        'special': 0,
        'xp': 40,
        'gold': 13
    },
    loggedIn: true,
    sessionId: 'ddc0e925 - b9e9 - 4e60 - a551 - 7d2da1ae074b',
    eventSteps: 2,
    lastDir: 9,
    lastLoc: {
        x: 41,
        y: 66,
        map: 'Norkos'
    },
    divineDirection: null,
    $profession: null,
    $professionData: null,
    $statistics: null,
    $statisticsData: null,
    $inventory: null,
    $inventoryData: null,
    $choices: null,
    $choicesData: null,
    $achievements: null,
    $achievementsData: null,
    $personalities: null,
    $personalitiesData: null,
    $collectibles: null,
    $collectiblesData: null,
    $pets: null,
    $petsData: null,
    $premium: null,
    $premiumData: null,
    $quests: null,
    $questsData: null,
} as unknown as IPlayer;
