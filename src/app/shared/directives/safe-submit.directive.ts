import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: 'button[appSafeSubmit]',
  standalone: true
})
export class SafeSubmitDirective {
  @Input() isProcessing = false;

  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.isProcessing) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    // Visually disable immediately
    this.el.nativeElement.setAttribute('disabled', 'true');
    this.el.nativeElement.innerText = 'Processing...';
    
    // (In a real app, you'd bind this to the Observable state to re-enable on error)
  }
}
