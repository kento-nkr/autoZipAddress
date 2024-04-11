# autoZipAddress

## How to use
    
1. `fieldcode_obj`の各要素のvalueを埋める。埋める値はFBのフィールドコード

2. `autoZipAddress(fieldcode_obj);`を実行し、FBに設定を反映させる

    ```js
    const fieldcode_obj = [
        {//FBフィールドコード
            zip: "郵便番号",
            state: "住所1",
            city: "住所2",
            addressLine: "住所3",
            city_ruby: "住所2カナ",
            addressLine_ruby: "住所3カナ",
        },
    ];

    autoZipAddress(fieldcode_obj);
    ```


## Depends on [KanaConverter.js](https://github.com/kento-nkr/kana_converter/blob/main/KanaConverter.js). KanaConverter.js is auto loaded.
