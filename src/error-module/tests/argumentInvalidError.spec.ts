//-- NPM Packages
import {expect} from 'chai';
import {base, en, en_CA, en_US, Faker} from '@faker-js/faker';

//-- Project Code
import {ArgumentInvalidError} from '@src';

const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:error-module', (): void => {
    describe('class:ArgumentInvalidError', (): void => {
        describe('.constructor()', (): void => {
            it('should set the `argumentName` property to the given value provided', (): void => {
                //-- Given
                const argumentName = faker.database.column();

                //-- When
                const result = new ArgumentInvalidError(argumentName);

                //-- Then
                expect(result.argumentName).to.equal(argumentName);
            });
            it('should set the default message if a custom message is not provided', (): void => {
                //-- Given
                const argumentName = faker.database.column();

                //-- When
                const result = new ArgumentInvalidError(argumentName);

                //-- Then
                expect(result.message).to.equal(
                    `Invalid argument "${argumentName}"`
                );
            });
            it('should set a custom message is one is provided', (): void => {
                //-- Given
                const argumentName = faker.database.column();
                const message = faker.word.words(5);

                //-- When
                const result = new ArgumentInvalidError(argumentName, message);

                //-- Then
                expect(result.message).to.equal(message);
            });
            it('should set the `name` property to `ArgumentInvalidError`', (): void => {
                //-- Given
                const argumentName = faker.database.column();
                const message = faker.word.words(5);

                //-- When
                const result = new ArgumentInvalidError(argumentName, message);

                //-- Then
                expect(result.name).to.equal('ArgumentInvalidError');
            });
        });
        describe('#toString()', (): void => {
            it('should output the argument name if a custom message is used when called', (): void => {
                //-- Given
                const argumentName = faker.database.column();
                const message = faker.word.words(5);
                const instance = new ArgumentInvalidError(
                    argumentName,
                    message
                );

                //-- When
                const result = instance.toString();

                //-- Then
                expect(result).to.contain(`(argument name: ${argumentName})`);
            });
            it('should not output the argument name if a custom message is not used when called', (): void => {
                //-- Given
                const argumentName = faker.database.column();
                const instance = new ArgumentInvalidError(argumentName);

                //-- When
                const result = instance.toString();

                //-- Then
                expect(result).to.not.contain(
                    `(argument name: ${argumentName})`
                );
            });
        });
    });
});
