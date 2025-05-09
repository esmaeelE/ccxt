import assert from 'assert';
import { sha256 } from '../../static_dependencies/noble-hashes/sha256.js';
import { sha1 } from '../../static_dependencies/noble-hashes/sha1.js';
import { md5 } from '../../static_dependencies/noble-hashes/md5.js';
import { ecdsa, crc32, hash, hmac } from '../../base/functions/crypto.js';
import { encode } from '../../base/functions/encode.js';
import { secp256k1 } from '../../static_dependencies/noble-curves/secp256k1.js';
import { rsa, jwt } from '../../base/functions/rsa.js';
// even though no AUTO_TRANSP flag here, this file is manually transpiled
function equals(a, b) {
    // does not check if b has more properties than a
    // eslint-disable-next-line no-restricted-syntax
    for (const prop of Object.keys(a)) {
        if (a[prop] !== b[prop]) {
            return false;
        }
    }
    return true;
}
function testCryptography() {
    // const exchange = new Exchange ();
    // ---------------------------------------------------------------------------------------------------------------------
    assert(hash(encode(''), sha256, 'hex') === 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    assert(hash(encode('cheese'), sha256, 'hex') === '873ac9ffea4dd04fa719e8920cd6938f0c23cd678af330939cff53c3d2855f34');
    assert(hash(encode(''), md5, 'hex') === 'd41d8cd98f00b204e9800998ecf8427e');
    assert(hash(encode('sexyfish'), md5, 'hex') === 'c8a35464aa9d5683585786f44d5889f8');
    assert(hash(encode(''), sha1, 'hex') === 'da39a3ee5e6b4b0d3255bfef95601890afd80709');
    assert(hash(encode('nutella'), sha1, 'hex') === 'b3d60a34b744159793c483b067c56d8affc5111a');
    assert(hmac(encode('hello'), encode('there'), sha256, 'hex') === '551e1c1ecbce0fe9b643745a376584a6289f5f43a46861b315fac9edc8d52a26');
    assert(hmac(encode('a message'), encode('a secret'), md5, 'hex') === '0bfa503bdbc7358185fcd49b4869e23d');
    // ---------------------------------------------------------------------------------------------------------------------
    const privateKey = '1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a';
    assert(equals(ecdsa('1a', privateKey, secp256k1, sha256), {
        'r': '23dcb2a2a3728a35eb1a35cc01743c4609550d9cceaf2083550f13a9eb135f9f',
        's': '317963fcac18e4ec9f7921b97d7ea0c82a873dd6299cbfb6af016e08ef5ed667',
        'v': 0,
    }));
    assert(equals(ecdsa(privateKey, privateKey, secp256k1, undefined), {
        'r': 'b84a36a6fbabd5277ede578448b93d48e70b38efb5b15b1d4e2a298accf938b1',
        's': '66ebfb8221cda925526e699a59cd221bb4cc84bdc563024b1802c4d9e1d8bbe9',
        'v': 1,
    }));
    // ---------------------------------------------------------------------------------------------------------------------
    //
    // assert (exchange.hashMessage (privateKey) === '0x59ea5d98c3500c3729f95cf98aa91663f498518cc401360df2912742c232207f');
    //
    // assert (equals (exchange.signHash ('0x59ea5d98c3500c3729f95cf98aa91663f498518cc401360df2912742c232207f', privateKey), {
    //     'r': '0x6f684aa41c02da83dac3039d8805ddbe79a03b1297e247c7742cab8dfc19d341',
    //     's': '0x62473881674550563cb028ff40a7846fd53620ddf40a20cc1003b8484a109a4a',
    //     'v': 27
    // }));
    //
    // assert (equals (exchange.signMessage (privateKey, privateKey), {
    //     'r': '0x6f684aa41c02da83dac3039d8805ddbe79a03b1297e247c7742cab8dfc19d341',
    //     's': '0x62473881674550563cb028ff40a7846fd53620ddf40a20cc1003b8484a109a4a',
    //     'v': 27
    // }));
    //
    // ---------------------------------------------------------------------------------------------------------------------
    const pemKeyArray = [
        '-----BEGIN RSA PRIVATE KEY-----',
        'MIIEpAIBAAKCAQEAqUtXQXv2uSm9zPvdJTRpu5/65rBjAoHmIiowAs+u7fY0QP9O',
        '+T8CZRQjvZrfPomBiccjCxDo8mm7GkmL67rs9s7VOMQFvpTTtMBeglNSEbXJ3wTt',
        '7WM5gD3ZAbhfGtwWdGpcOMX0hV5/d/fiw1zQk0+AooayTryZ7HV+DQcD1sGTYYir',
        'LePUGkKV2NCvKtGOQfRAtuo0ccigMxMvEhWuExCc9Fhd077OpXMc0n7OiFqA2JWN',
        'jlocM9S71Srvw/lDos8a7lGaFUV8gP1CsQY/4qTju6hhsRd4lFujVr5J9FqmDbnv',
        'wQ79SSu6+lT0+ToFdDHiYOorBK2ESFR7EzlyLwIDAQABAoIBAEobQMbZjNbg/sSM',
        'O/HdT6tiDGKPM8gVNLgf34RbhSeFbrpFCDzy6Al3F24YLUEi0CGPmjdt34q93blU',
        'GHvIB5LCV3PR2vHiFAo7ayOBdZtrCEMn1T7lAHaynBu0qW0IiovLQzNW9AKtqv7I',
        '8+qw5lyVoKmEbOkqhfaMN/Fb8MJAo3yEVyhyp4EjtFhqDQ9DuHEjp1jGthnMgm+4',
        'qFyELf0DXZSAN+R9IGDqWPyo78lOcPW4pgeLuoLQ6Nn/2JAEGHFt1a7zMEw5yYbR',
        'XB89Bh0dheSmopBN6Heay4YuhnNKua37OlL1/nhKpLGUNE3z/UOXeiUiMeE1C2i+',
        'GjK+xgECgYEA4XH63rJ3VYDHHWUGlWffFWkEpgR4BDEkZ8MyVYQoUjQA2TpCvQ2+',
        'bR7aAIGXhBnRTrIBNu9m4+am0aUfi1hVmVHqt1b2vFgEb9uKuO4U62tCFpeji+Rz',
        '8C8QJyu5v5OUWdQZ4EA0d7ljeoTl50g8tpcGsDhnImLt+/jvJuFt8dECgYEAwD0n',
        'rhlkEjKVHxu1xwKeczxYCqqcUV9Quq8HnPh4VJQ77ljfZ57V7sAKrFDi5XfVD9jS',
        'oJPwxjw6za134VobhdvCM6WNs6AJmbR8E/b5kDMbGaZn27vt+/8JfnGaWBqpDi6W',
        'a5xoJOqmcMBQBK1YleZDoY4PLbk+onVKLMfGI/8CgYEAkyUIv8euGdGWpHnm5SdJ',
        'tLi5vv4Vs267uzntJWG/y3+DukTLgIdy7dgAI+pxkVgkg/+syUVSW5eU9CqZPyLl',
        'o8+Sqh2Jp36vTq71iSRj5RA5r3ND3K+8eFzPZzGj6AWUA1lrljFxzV7kLfiF8gH1',
        'FpvWUrhNoGT/vcFJno/uabECgYAecRC5hxfLserfVDoC261PvjyK492BHUDhbxob',
        'h1U2v4qGAdjOxd5Gwm5uPxjPEZzRt5oTB5pXKe5953xWWTiGh/hGyW6ZBTy/9E65',
        'sqBub0lZVHqZ1zamcwqD1WWFkiM3NbVoMQpk3iuhKzMAqpqekiofiSlqKi16+GvY',
        'j4IW7QKBgQCrIUckPZ6IY3ERIN1IL4TIcK2gOJcznp7fLWpC+sv35ya3OhtDXKFt',
        'GjIHmwLuiUNc0iPzA9Rw89W0zIkKWmWcxM88/ithdxh3MEeNDUGSnd4hQ9SECwxB',
        'Wem3eBT7I4VtFYoaTE3/bX1SKfgBdTzIRqWKSDpgBNZg/P2Tc+s11g==',
        '-----END RSA PRIVATE KEY-----',
    ];
    const pemKey = pemKeyArray.join("\n");
    assert(rsa('hello', pemKey, sha256) === 'PqHotvSEBvM/AejnMOWBXUcOf3uHtcGu2zAYdlYdnlNSSQ80Uq4lcyAEstnZ2AnQJ9l5TCC53uoRZ26GQ47zlACgqtYglmPhQKLvQ5fldRzeBauYhGgM2C0mUuUGxh074fNGbK+bgmwEmDMIrnSPtXwiCqTAHh+8VEnC7us3t09D61y298dPBJYEBNN3dFZT0w0pCIQg3j3DSiFJOCfywmOKyXqS1pvmk6A38DVclQZORQ5WZXp2yvSKRLjxpzjxDl76h1GfbBl7sMLEFMyzk0wyIhIz8ZELMibYn036G4X1IcSlDcimthEkIbn2QjM0ntyYDZIS4QnsMBjvkV2UHw==');
    assert(rsa('poopy', pemKey, sha256) === 'or069qHwRDyl162T1s5G5+LfLnvDxlgk9kEsJvwI3vM02KB1LHW4+8gWqsV4TENZpeqed2Tb4na6ex+L/UR8JxJnnZtpVp33nUBgcp3miqp/YhcGN4++qolP4YN/21/AyfLFZW+VYggc+Mhh6PJSm+0dSEWMVsP35uH+35abXVxgB8GVOn7YTOSPaL8aw7hn4wlZWf2ieikKAi7AwAjkxnd7/Bu5+cW8D+ZdPHQfSKj+XHuPXlJNuQX0MDIqhdD2yuYJOQL56eKYs6nHPlClATkndSaAemQSGKet3X3Iz1awG4MGgz2Ei6bOanlNugc0f6Rng6rdwmqiMU3G4it6cw==');
    assert(jwt({ 'chicken': 'salad' }, encode(pemKey), sha256, true) === 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGlja2VuIjoic2FsYWQifQ.FSKD5Y6RNzkHTuHdvG3753U7QNZ-u-GUSPfP1FMjEaK0Rr_iyQTSSmHhkdYSFFnmBvrrN_l-UwKwir52WlsgmQm9HYm0kidxbj7fWwrK2E1oe0P7OjupFjv1BZxc5W69WeaHtOPWe28tiHiON1LCnax6HgfI5lcIBsESGIIBZMVeaioQn9gDVwea7JxJvAlrhDIWZowIHTIdCQocXip7g5jREWHeEIuJNug67mwnfAFxCjvTRiTd0Bw6oBwjM3FLya-RyEyWrejQOWSuC8CNWVUHISaSmEyZ7uM6wTi2m_58TaE9mQwlef32OPErPvvBpgL5pZIyQ4ymwrCIFQLBQQ');
    assert(jwt({ 'lil': 'xan' }, encode('betrayed'), sha256, false) === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsaWwiOiJ4YW4ifQ.md-oFvZagA-NXmZoRNyJOQ7zwK-PWUMmMQ_LI9ZOKaM');
    assert(crc32('hello', true) === 907060870);
    assert(crc32('tasty chicken breast :)', true) === 825820175);
    assert(crc32('21101:0.00123125:21102:-0.001:21100:0.710705:21103:-0.001:21096:0.71076:21104:-0.001:21094:1.0746:21105:-0.001:21093:0.710854:21106:-0.419:21092:0.01368102:21107:-0.001:21090:0.710975:21109:-0.001:21089:0.63586344:21110:-1.186213:21087:0.299:21111:-0.48751202:21086:0.9493:21112:-0.03702409:21082:0.03537667:21113:-0.712385:21081:0.00101366:21114:-0.2903:21079:0.710713:21115:-0.001:21078:0.997048:21116:-0.60089827:21077:0.23770225:21117:-0.83201:21076:0.03619135:21118:-0.09996142:21075:0.1272433:21119:-1.09681107:21074:0.7447885:21120:-0.04771792:21073:0.0011:21121:-0.91495684:21072:0.73311632:21122:-0.07940416:21071:0.09817:21123:-0.39376843:21070:0.19101052:21124:-1.51692599:21069:0.2757:21125:-0.11107322:21068:0.12480303:21126:-0.12704666:21067:0.4201:21128:-0.12804666', true) === -51055998);
    // assert (eddsa ('1b1b', privateKey, ed25519) === '3DBaaz8z4Pq9n6ncNCjB4pFLWaWTXbjaCUqKQmBgS3w7AP6opeDqANBhPssbV3jyfJB4LfK8kGR6pu6GU8fbjMuy');
}
export default testCryptography;
