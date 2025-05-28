//-- NPM
// @ts-types="npm:@types/chai"
import {expect} from 'npm:chai';

//-- Project Code
import * as m from '@src';

Deno.test({
    name: 'module:index.sayHello',
    fn() {
        //-- Given
        const name = 'World';

        //-- When
        const result = m.sayHello(name);

        //-- Then
        expect(result).to.equal(`Hello, ${name}!`);
    }
});
