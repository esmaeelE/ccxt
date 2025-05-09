import assert from 'assert';
import testLastPrice from './base/test.lastPrice.js';
import testSharedMethods from './base/test.sharedMethods.js';
async function testFetchLastPrices(exchange, skippedProperties, symbol) {
    const method = 'fetchLastprices';
    // log ('fetching all tickers at once...')
    let response = undefined;
    let checkedSymbol = undefined;
    try {
        response = await exchange.fetchLastPrices();
    }
    catch (e) {
        response = await exchange.fetchLastPrices([symbol]);
        checkedSymbol = symbol;
    }
    assert(typeof response === 'object', exchange.id + ' ' + method + ' ' + checkedSymbol + ' must return an object. ' + exchange.json(response));
    const values = Object.values(response);
    testSharedMethods.assertNonEmtpyArray(exchange, skippedProperties, method, values, checkedSymbol);
    let atLeastOnePassed = false;
    for (let i = 0; i < values.length; i++) {
        // todo: symbol check here
        testLastPrice(exchange, skippedProperties, method, values[i], checkedSymbol);
        atLeastOnePassed = atLeastOnePassed || (exchange.safeNumber(values[i], 'price') > 0);
    }
    assert(atLeastOnePassed, exchange.id + ' ' + method + ' ' + checkedSymbol + ' at least one symbol should pass the test');
    return true;
}
export default testFetchLastPrices;
