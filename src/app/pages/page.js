"use client";
// Reactをインポートします
import React from 'react';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [productCode, setProductCode] = useState('');
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [purchaseList, setPurchaseList] = useState([]);
  const [total, setTotal] = useState(0);  // ここで total と setTotal を定義
  const [showPopup, setShowPopup] = useState(false);  // ポップアップの表示状態を管理


  // 商品情報を取得する関数
  const fetchProduct = async () => {
    if (!productCode || isNaN(productCode)) {
      setError('有効な商品コードを入力してください');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://tech0-gen-7-step4-studentwebapp-pos-24-b2gng6bvegafh3es.eastus-01.azurewebsites.net/products/${productCode}`);
      setProduct(response.data);
      setError('');
    } catch (error) {
      setProduct(null);
      setError('商品がマスタ未登録です');
    } finally {
      setLoading(false);
    }
  };
// 商品を購入リストに追加
  const addProductToList = () => {
    if (!productCode || !productName || !productPrice) return;
    
    const newItem = {
      prd_id: Math.random(),  // 仮のIDを作成（実際はバックエンドで処理）
      code: productCode,
      name: productName,
      price: parseFloat(productPrice),
    };
    setPurchaseList([...purchaseList, newItem]);
    setProductCode('');
    setProductName('');
    setProductPrice('');
  
  };

  // 購入を確定してサーバーにデータを送信
  const finalizePurchase = async () => {
    try {
      const response = await axios.post('https://tech0-gen-7-step4-studentwebapp-pos-24-b2gng6bvegafh3es.eastus-01.azurewebsites.net/purchases', {
        emp_cd: '999',
        store_cd: '30',
        pos_no: '90',
        products: purchaseList
      });
      setTotal(response.data.total_amount);
      setShowPopup(true);
    } catch (error) {
      console.error('購入に失敗しました', error.response.data);
    }
  };

  // 購入完了後にリセット
  const completePurchase = () => {
    setShowPopup(false);
    setPurchaseList([]);
    setTotal(0);
  };

  // // 合計金額を計算
  // const calculateTotal = () => {
  //   const totalAmount = purchaseList.reduce((acc, item) => acc + item.PRICE, 0);
  //   setTotal(totalAmount);
  //   setShowPopup(true);
  // };


  // // 購入後にリセット
  // const completePurchase = () => {
  //   // DBに購入データを送信
  //   axios.post('http://127.0.0.1:8000/purchases', {
  //     // items: purchaseList,
  //     cashier_code: '999',  // レジ担当者コード
  //     pos_id: '90',
  //     total: total,
  //     items: purchaseList.map(item => ({
  //       PRD_ID: item.PRD_ID,  // item から各フィールドを取得
  //       PRD_CODE: item.CODE,
  //       PRD_NAME: item.NAME,
  //       PRD_PRICE: item.PRICE
  //     }))  
  //   })
  //     .then(() => {
  //       // 全てのリストと入力エリアをクリア
  //       setPurchaseList([]);  // 購入リストをクリア
  //       // setProduct(null);     // 商品情報をクリア
  //       setTotal(0);          // 合計金額をクリア
  //       setShowPopup(false);  // ポップアップを閉じる
  //     })
  //     .catch((error) => {
  //       console.error('購入に失敗しました', error);
  //     });
  // };


  return (
    <div style={{ padding: '100px' }}>
      {/* <h1>商品コード入力</h1> */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '200px', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="商品コードを入力"
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
          style={{textAlign: 'center'}}
        />
        <button onClick={fetchProduct}>商品コード読み込み</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {product && (
        <div>
          <h2>商品情報</h2>
          <p>名称: {product.NAME}</p>
          <p>価格: ¥{product.PRICE}</p>
          <button onClick={addProductToList}>  追加  </button>
        </div>
      )}
      <h2>購入品目リスト</h2>
      <ul>
        {purchaseList.map((item, index) => (
          <li key={index}>
            {item.NAME} - ¥{item.PRICE}
          </li>
        ))}
      </ul>

      {purchaseList.length > 0 && (
        <div>
          <button onClick={calculateTotal}>購入</button>
        </div>
      )}

      {showPopup && (
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '20px', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
          <h2>合計金額: ¥{total}</h2>
          <button onClick={completePurchase}>OK</button>
        </div>
      )}
    </div>
  );
}

