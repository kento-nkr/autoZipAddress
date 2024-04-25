function autoZipAddress(fieldcode_obj)
{
    if (!fieldcode_obj.hasOwnProperty("zip"))
    {
        console.error("autoZipAddress(fieldcode_obj) argument required zip property.");
        return;
    }
    fb.events.fields[fieldcode_obj.zip].changed.push((state) =>
    {
        const input_value = state.record[fieldcode_obj.zip].value.replaceAll("-", "");  //ハイフンを取り除く
        if (input_value.length == 7)
        {
            const KC = new KanaConverter();
            const post_url = "https://zipcloud.ibsnet.co.jp/api/search?zipcode=";
            const res = fetch(post_url + input_value.toString(), {
                timeout: 10000,
            });
            res
                .then((response) => response.json())
                .then((data) =>
                {
                    switch (data.status)
                    {
                        case 400:
                            console.error("入力パラメータエラー");
                            break;
                        case 500:
                            console.error("Internal server error.");
                            break;
                        case 200:
                            if (data.results === null) console.error("郵便番号から住所が見つかりませんでした。");
                            else
                            {
                                const fetch_reesult = data.results[0]
                                console.log("fetch result : ", fetch_reesult);
                                state.record[fieldcode_obj.state].value = ""
                                state.record[fieldcode_obj.city].value = ""
                                state.record[fieldcode_obj.addressLine].value = ""
                                state.record[fieldcode_obj.city_ruby].value = ""
                                state.record[fieldcode_obj.addressLine_ruby].value = ""

                                state.record[fieldcode_obj.zip].value = input_value.slice(0, 3) + "-" + input_value.slice(3);
                                state.record[fieldcode_obj.state].value += fetch_reesult.address1;
                                state.record[fieldcode_obj.city].value += fetch_reesult.address2;
                                state.record[fieldcode_obj.addressLine].value += fetch_reesult.address3;
                                // state.record[fieldcode_obj.state_ruby].value = KC.halfToFull(fetch_reesult.kana1);
                                state.record[fieldcode_obj.city_ruby].value += KC.halfToFull(fetch_reesult.kana2);
                                state.record[fieldcode_obj.addressLine_ruby].value += KC.halfToFull(fetch_reesult.kana3);
                            }
                    }
                    return state;
                });
        }
    });
}

function loadKanaConverter()
{
    const url = "https://cdn.jsdelivr.net/gh/kento-nkr/kana_converter/KanaConverter.js"
    return new Promise((resolve, reject) =>
    {
        let script = document.createElement("script");
        script.onload = resolve;
        script.onerror = reject;
        script.src = url;

        document.head.appendChild(script);
    });
}

try
{
    new KanaConverter()
}
catch (e)
{
    loadKanaConverter()
}
