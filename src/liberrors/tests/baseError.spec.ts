//-- NPM Packages
import {expect} from 'chai';
import {base, en, en_CA, en_US, Faker} from '@faker-js/faker';

//-- Project Code
import {BaseError} from '@src';

const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:error-module', (): void => {
    describe('class:BaseError', (): void => {
        describe('.constructor()', (): void => {
            it('should set the `message` property to an empty string if a custom message is not provided', (): void => {
                //-- Given

                //-- When
                const result = new BaseError();

                //-- Then
                expect(result.message).to.be.empty;
            });
            it('should set a custom error message', (): void => {
                //-- Given
                const message = faker.word.words(5);

                //-- When
                const result = new BaseError(message);

                //-- Then
                expect(result.message).to.equal(message);
            });
            it('should set the `hasCustomMessage` property to `true` when a custom error message is used', (): void => {
                //-- Given
                const message = faker.string.alphanumeric(5);

                //-- When
                const result = new BaseError(message);

                //-- Then
                expect(result.hasCustomMessage).to.be.true;
            });
            it('should set the `hasCustomMessage` property to `false` when a custom error message is not used', (): void => {
                //-- Given

                //-- When
                const result = new BaseError();

                //-- Then
                expect(result.hasCustomMessage).to.be.false;
            });
            it('should set the `name` property to `BaseError`', (): void => {
                //-- Given

                //-- When
                const result = new BaseError();

                //-- Then
                expect(result.name).to.equal('BaseError');
            });
        });
    });
});
