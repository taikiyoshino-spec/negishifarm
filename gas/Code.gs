/**
 * 根岸FARM 予約フォーム バックエンド（Google Apps Script）
 *
 * セットアップ手順は README.md を参照してください。
 * このファイルはリポジトリには参照用に置いてあるだけで、
 * サイトの動作には関与しません。nesscamod@gmail.com の
 * Google スプレッドシート付属の Apps Script エディタに
 * このファイルの内容をそのまま貼り付けてデプロイしてください。
 */

var STAFF_EMAIL = 'nesscamod@gmail.com';
var SHEET_NAME = '予約';
var FARM_NAME = '根岸FARM';
var FARM_PHONE = '080-6003-1840';

function doPost(e) {
  var p = e.parameter;

  appendReservationRow_(p);

  if (p.email) {
    sendCustomerMail_(p);
  }
  sendStaffMail_(p);

  return ContentService.createTextOutput('OK');
}

function appendReservationRow_(p) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      '受信日時', 'お名前', '来園希望日', '来園希望時刻',
      '大人', '小学生以上', '幼児', '電話番号', 'メールアドレス', 'ペット同伴', 'その他要望'
    ]);
  }
  sheet.appendRow([
    new Date(),
    p.name || '',
    p.date || '',
    p.time || '',
    p.adults || '0',
    p.elementary || '0',
    p.infants || '0',
    p.phone || '',
    p.email || '',
    p.pet ? 'あり' : 'なし',
    p.notes || ''
  ]);
}

function reservationSummary_(p) {
  return [
    'お名前：' + (p.name || ''),
    '来園希望日：' + (p.date || ''),
    '来園希望時刻：' + (p.time || ''),
    '人数：大人 ' + (p.adults || '0') + '名 / 小学生以上 ' + (p.elementary || '0') + '名 / 幼児 ' + (p.infants || '0') + '名',
    '電話番号：' + (p.phone || ''),
    'メールアドレス：' + (p.email || ''),
    'ペット同伴：' + (p.pet ? 'あり' : 'なし'),
    'その他ご要望：' + (p.notes || 'なし')
  ].join('\n');
}

function sendCustomerMail_(p) {
  var subject = '【' + FARM_NAME + '】ご予約を受け付けました';
  var body =
    (p.name || 'お客') + ' 様\n\n' +
    '※このメールはシステムからの自動返信です。\n\n' +
    FARM_NAME + 'です。以下の内容でご予約を受け付けました。\n' +
    '収穫状況により内容をご確認・ご連絡させていただく場合がございます。\n\n' +
    reservationSummary_(p) + '\n\n' +
    '当日の開園状況はホームページでもご確認いただけます。\n' +
    'ご不明な点がございましたら、お電話（' + FARM_PHONE + '）にてお問い合わせください。\n\n' +
    FARM_NAME;

  MailApp.sendEmail(p.email, subject, body);
}

function sendStaffMail_(p) {
  var subject = '【' + FARM_NAME + '】新しい予約が届きました';
  var body = '新しいご予約がありました。\n\n' + reservationSummary_(p);

  MailApp.sendEmail(STAFF_EMAIL, subject, body);
}
