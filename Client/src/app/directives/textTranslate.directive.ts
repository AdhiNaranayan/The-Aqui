import { Directive, OnInit, ElementRef } from '@angular/core';
import { LANGUAGE_DICTIONARY } from '../dataCollection/languageDictionary';

@Directive({
   // tslint:disable-next-line: directive-selector
   selector: '[TextTranslate]'
})
export class TextTranslateDirective implements OnInit  {
   // Hindi, Tamil, Telugu, Kannada, Malayalam, English

   private dictionary = LANGUAGE_DICTIONARY;
   sessionLanguage = 'en';
   defaultLanguage = 'en';

   constructor(private el: ElementRef) { }

   ngOnInit() {
      this.sessionLanguage = sessionStorage.getItem('lan');
      console.log(this.sessionLanguage);
      
      const value = this.el.nativeElement.innerText;
      if (this.sessionLanguage !== undefined && this.sessionLanguage !== null && this.dictionary[this.sessionLanguage] != null) {
         if (this.dictionary[this.sessionLanguage].values[value] !== undefined && this.dictionary[this.sessionLanguage].values[value] !== '') {
            const newValue = this.dictionary[this.sessionLanguage].values[value];
            this.el.nativeElement.innerText = newValue;
         } else {
            alert('Unable to translate the Text "' + value + '" in language **' + this.dictionary[this.sessionLanguage].language + '**');
         }
      } else {
         const newValue = this.dictionary[this.defaultLanguage].values[value];
         this.el.nativeElement.innerText = newValue;
      }
   }

}
