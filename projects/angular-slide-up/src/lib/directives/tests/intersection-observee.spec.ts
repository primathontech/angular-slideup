import {Component, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {IntersectionObserverModule} from '../../module';
import {INTERSECTION_ROOT_MARGIN} from '../../tokens/intersection-root-margin';
import {INTERSECTION_THRESHOLD} from '../../tokens/intersection-threshold';
import {IntersectionObserverDirective} from '../intersection-observer.directive';

describe('IntersectionObserveeDirective', () => {
    @Component({
        template: `
            <div id="manual_observee">Hello</div>
            <section
                *ngIf="observe"
                #root
                id="observer_root"
                style="position: relative; height: 200px; overflow: auto;"
                waIntersectionThreshold="0.5"
                waIntersectionObserver
                waIntersectionRoot
            >
                <div style="height: 900px;">Height expander</div>
                <h1
                    style="position: absolute; top: 200px; height: 200px;"
                    (waIntersectionObservee)="onIntersection($event)"
                >
                    I'm being observed
                </h1>
                <h1
                    style="position: absolute; top: 200px; height: 200px;"
                    waIntersectionObserver
                    (waIntersectionObservee)="onIntersection($event)"
                >
                    Default values
                </h1>
            </section>
        `,
    })
    class TestComponent {
        @ViewChild('root', {read: IntersectionObserverDirective})
        observer!: IntersectionObserverDirective;

        onIntersection = jasmine.createSpy('onIntersection');
        observe = true;
    }

    let fixture: ComponentFixture<TestComponent>;
    let testComponent: TestComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [IntersectionObserverModule],
            declarations: [TestComponent],
        });

        fixture = TestBed.createComponent(TestComponent);
        testComponent = fixture.componentInstance;
        fixture.detectChanges();
        testComponent.onIntersection.calls.reset();
    });

    it('Emits intersections', done => {
        document.querySelector('#observer_root')!.scrollTop = 350;
        fixture.detectChanges();

        setTimeout(() => {
            expect(testComponent.onIntersection).toHaveBeenCalled();
            document.querySelector('#observer_root')!.scrollTop = 0;
            fixture.detectChanges();
            testComponent.observe = false;
            fixture.detectChanges();
            done();
        }, 100);
    });

    it('Compatible with native method signature', () => {
        expect(() =>
            testComponent.observer.observe(document.querySelector('#manual_observee')!),
        ).not.toThrow();
    });

    it('Default options', () => {
        // https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver
        expect(TestBed.get(INTERSECTION_ROOT_MARGIN)).toBe('0px 0px 0px 0px');
        expect(TestBed.get(INTERSECTION_THRESHOLD)).toBe(0);
    });
});
