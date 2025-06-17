/// <reference types="@types/deno" />
/// <reference types="@types/mocha" />

//-- NPM Packages
import {expect} from 'chai';
import {base, en, en_CA, en_US, Faker} from '@faker-js/faker';

//-- Project Code
import {BaseError} from '@src';

/**
 * The fake data provider.
 */
const fake = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('lib:error-module', (): void => {
    describe('.BaseError', (): void => {
        describe('.constructor()', (): void => {
            it('should pass the `message` argument on', (): void => {
                //-- Given
                const message = fake.lorem.sentence();

                //-- When
                const result = new BaseError(message);

                //-- Then
                expect(result.message).to.equal(message);
            });
            it('should pass the `opts` argument on', (): void => {
                //-- Given
                const message = fake.lorem.sentence();
                const causeMessage = fake.lorem.sentence();
                const cause = new Error(causeMessage);

                //-- When
                const result = new BaseError(message, {cause});

                //-- Then
                expect(result.cause).to.equal(cause);
                expect(result.cause?.message).to.equal(causeMessage);
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
