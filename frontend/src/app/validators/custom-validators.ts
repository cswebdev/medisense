import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  
    static fieldsMatchValidator(field1: string, field2: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value1 = control.get(field1)?.value;
            const value2 = control.get(field2)?.value;
            return value1 === value2 ? null : { fieldsMismatch: true };
        };
    }
      

    static capitalLetterValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            const hasCapitalLetter = /[A-Z]+/.test(value);
            return hasCapitalLetter ? null : { noCapitalLetter: true };
        };
    }

    static numberValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            const hasNumber = /[0-9]+/.test(value);
            return hasNumber ? null : { noNumber: true };
        };
    }

    static specialCharacterValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]+/.test(value);
            return hasSpecialCharacter ? null : { noSpecialCharacter: true };
        };
    }

    static whitespaceValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            const hasWhitespace = /\s/.test(value);
            return !hasWhitespace ? null : { whitespace: true };
        };
    }
}
