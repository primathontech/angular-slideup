import {take} from 'rxjs/operators';
import {IntersectionObserverService} from '../intersection-observer.service';

describe('IntersectionObserverService', () => {
    it('works', done => {
        let called = false;

        const nativeElement = document.createElement('div');
        const service = new IntersectionObserverService(
            {
                nativeElement,
            },
            true,
            '0px 0px 0px 0px',
            0,
            {
                nativeElement: document.body,
            },
        );

        service.pipe(take(1)).subscribe({
            next: () => {
                called = true;
            },
        });

        document.body.appendChild(nativeElement);

        setTimeout(() => {
            expect(called).toBe(true);
            done();
        });
    });

    it('throws when not supported', () => {
        let error = false;
        const service = new IntersectionObserverService(
            {
                nativeElement: document.createElement('DIV'),
            },
            false,
            '0px 0px 0px 0px',
            0,
            null,
        );

        service.subscribe({
            error: () => {
                error = true;
            },
        });

        expect(error).toBe(true);
    });
});
