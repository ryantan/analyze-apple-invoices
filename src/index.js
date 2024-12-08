function extractPurchaseDetails(doc) {
  // Extract the date
  const dateElement = doc.querySelector('.invoice-date');
  const date = dateElement ? dateElement.textContent.trim() : null;
  const parsedDate = new Date(date);
  // console.log(parsedDate);
  const month = parsedDate.getMonth() + 1;
  const year = parsedDate.getFullYear();
  const statement = `${year}${month < 10 ? '0' + month : month}`;

  // Extract the WebOrder ID
  const webOrderElement = doc.querySelector('.second-element span');
  const webOrderId = webOrderElement ? webOrderElement.textContent.trim() : null;

  // Extract the item description and price
  const itemList = doc.querySelectorAll('.pli-list .pli');
  const items = Array.from(itemList).map(item => {
    const descriptionElement = item.querySelector('.pli-title');
    const description = descriptionElement ? descriptionElement.textContent.trim() : 'Unknown Item';

    const priceElement = item.querySelector('.pli-price span');
    const price = priceElement ? priceElement.textContent.trim() : 'Unknown Price';

    const publisherElement = item.querySelector('.pli-publisher');
    const publisher = publisherElement ? publisherElement.textContent.trim() : 'Unknown publisher';

    return { description, price, publisher };
  });

  // Extract the total amount
  const totalAmountElement = doc.querySelector('.purchase-header .third-element span');
  const totalAmountString = totalAmountElement ? totalAmountElement.textContent.trim().replace('Total ', '') : 'Unknown Total';
  let totalAmount = 0;
  if (totalAmountString.toLowerCase() !== 'free' && totalAmountString.toLowerCase().startsWith('S$ ')) {
    totalAmount = Number(totalAmountString.substring('S$ '.length));
  }

  return {
    date,
    statement,
    webOrderId,
    items,
    totalAmountString,
    totalAmount,
  };
}

const sections = Array.from(document.querySelectorAll('.purchase.loaded'));
const data = sections.map(item => extractPurchaseDetails(item));
const rows = data.flatMap(row => row.items.map(item => `${row.statement}|${row.date}|${row.webOrderId}|${item.publisher}|${item.description} |${item.price}`))
const exportedRows = rows.join('\n');

