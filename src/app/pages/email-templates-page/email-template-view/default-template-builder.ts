export function getDefaultEmailTemplateBodyForType(type: string): string {
  switch (type) {
    case 'initialorders': return getDefaultInitialOrderTemplateBody();
    case 'allorders': return getDefaultAllOrdersTemplateBody();
    case 'refund': return getDefaultRefundTemplateBody();
    case 'return': return getDefaultReturnTemplateBody();
    case 'cancellation': return getDefaultCancellationTemplateBody();
    case 'decline': return getDefaultDeclinesTemplateBody();
    case 'initialfulfillment': return getDefaultInitialFulfillmentTemplateBody();
    case 'allfulfillments': return getDefaultAllFulfillmentsTemplateBody();
    default: return '';
  }
}

function getDefaultInitialOrderTemplateBody(): string {
  return `<table width="100%" style="box-sizing: border-box; width: 100%; font-family: Helvetica, Arial, Verdana, Trebuchet MS;">
  <tbody id="i3wj" style="box-sizing: border-box;">
	<tr id="ii4dh" style="box-sizing: border-box; height: 95px; background: #C4C4C4;">
	  <td id="irrfl" align="center" style="box-sizing: border-box; text-align: center; background: {{accountdetails.emailtemplatesettings.color_primary}};">
		<img src="{{accountdetails.company_logo}}" alt="Company Logo" id="iuzqz" style="box-sizing: border-box; max-height: 60px; min-height: 40px; min-width: 40px; color: #ffffff;">
	  </td>
	</tr>
	<tr id="izxi" style="box-sizing: border-box;">
	  <td id="i39sy" align="center" style="box-sizing: border-box; text-align: center;">
		<table id="ixqzi" width="100%" style="box-sizing: border-box; width: 100%; max-width: 650px; margin: 25px auto 60px; font-size: 13px;">
		  <tbody id="ieefy" style="box-sizing: border-box;">
			<tr id="if7y4" style="box-sizing: border-box; height: 100px;">
			  <td id="iu7pb" style="box-sizing: border-box;">
				<section id="title-section" style="box-sizing: border-box; text-align: center;">
				  <div id="in50k" style="box-sizing: border-box; margin-bottom: 12px; font-size: 22px;">Thank you for your order, {{customer.firstname}}!
				  </div>
				  <div id="irq2q" style="box-sizing: border-box; line-height: 24px; color: #5F6368;">We’re getting your order ready to be shipped. We will notify you once it has been shipped out.
				  </div>
				</section>
				<div id="i71bh" style="box-sizing: border-box; padding: 0 10px 0 0; font-size: 18px; line-height: 22px; margin: 16px 0 12px 0; text-align: left;">
				  <b id="izcqa" style="box-sizing: border-box;">Order Details
				  </b>
				</div>
				<table width="100%" height="60" id="i5952" style="box-sizing: border-box; height: 60px; width: 100%; font-size: 13px; border: 1px solid rgba(0,0,0,0.12);">
				  <tbody id="iqdi2" style="box-sizing: border-box;">
					<tr id="irbyv" style="box-sizing: border-box;">
					  <td id="iey8k" style="box-sizing: border-box; padding: 0 0 0 0;">
						<section id="order-basic-details-section" style="box-sizing: border-box; max-width: 650px; border-bottom: 1px solid #E5E5E5; margin: 0 auto; padding: 10px 10px 10px 10px;">
						  <table id="ifedw" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; font-weight: bold; color: #202124;">
							<tbody id="ickv4" style="box-sizing: border-box;">
							  <tr id="iw03h" style="box-sizing: border-box;">
								<td id="ixg1a" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
								  <div id="iu9ei" style="box-sizing: border-box;">Order ID #{{rebill.alias}}
								  </div>
								</td>
								<td id="ikk5q" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%;">
								  <div id="ii334" style="box-sizing: border-box;">Order placed {{formatDate rebill.bill_at 'MMM D, YYYY'}}
								  </div>
								</td>
							  </tr>
							</tbody>
						  </table>
						</section>
						<section id="order-products-details-section" style="box-sizing: border-box; max-width: 650px; margin: 0 auto; padding: 0 0 0 0;">{{#order.products}}
						  <table id="ijpss" width="100%" style="box-sizing: border-box; font-size: 13px; border-bottom: 1px solid #E5E5E5; margin: 0 0 0 0; width: 100%;">
							<tbody id="ic41g" style="box-sizing: border-box;">
							  <tr id="iwfau" style="box-sizing: border-box; padding: 0 10px 0 0;">
								<td id="i6j2i" width="80%" align="left" style="box-sizing: border-box; text-align: left; width: 80%; padding: 10px 0;">
								  <table id="idfj2" style="box-sizing: border-box;">
									<tbody id="i7l5f" style="box-sizing: border-box;">
									  <tr id="id6ot" style="box-sizing: border-box;">
										<td id="ik5kxq" width="60" style="box-sizing: border-box; width: 60px;">
										  <img src="{{image}}" alt="" id="ik2q9r" style="box-sizing: border-box; min-width: 60px; max-width: 160px; min-height: 60px; background: grey; display: inline-block; margin: 0 0 0 10px;">
										</td>
										<td id="isqh9" style="box-sizing: border-box;">
										  <div id="isn859" style="box-sizing: border-box; margin-left: 30px;">
											<div id="ixr048" style="box-sizing: border-box; line-height: 24px; font-weight: bold; font-size: 18px;">{{product.name}}
											</div>
											<div id="i3xru7" style="box-sizing: border-box; line-height: 24px; color: #5F6368;">QTY: {{quantity}}
											</div>
										  </div>
										</td>
									  </tr>
									</tbody>
								  </table>
								</td>
								<td id="irkb0y" width="20%" align="right" style="box-sizing: border-box; text-align: right; width: 20%; color: #5F6368; font-weight: bold; margin: 0  0 0; padding: 1px 10px 1px 1px;">\${{amount}}
								</td>
							  </tr>
							</tbody>
						  </table>{{/order.products}}    
						</section>
						<div id="ivhau" style="box-sizing: border-box;">
						  <section id="order-pricing--details-section" style="box-sizing: border-box; max-width: 650px; border-bottom: 1px solid #E5E5E5; margin: 0 auto; padding: 10px 10px 10px 10px;">
							<table id="ign7z4" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; color: #5F6368;">
							  <tbody id="ia0qi" style="box-sizing: border-box;">
								<tr id="ip5as" style="box-sizing: border-box;">
								  <td id="iwxmrd" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
									<div id="i7gl1" style="box-sizing: border-box;">Subtotal
									</div>
								  </td>
								  <td id="itw02j" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%; font-weight: bold;">
									<div id="iu3ak" style="box-sizing: border-box;">\${{rebill.amount}}
									</div>
								  </td>
								</tr>
							  </tbody>
							</table>{{#rebill.shipping_receipts}}
							<table id="irm2ys" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; color: #5F6368;">
							  <tbody id="iximk" style="box-sizing: border-box;">
								<tr id="iw4ib" style="box-sizing: border-box;">
								  <td id="ig5w4g" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
									<div id="izj41" style="box-sizing: border-box;">Shipping {{tracker.carrier}}
									</div>
								  </td>
								  <td id="i57fa3" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%; font-weight: bold;">
									<div id="i5xdi" style="box-sizing: border-box;">\${{amount}}
									</div>
								  </td>
								</tr>
							  </tbody>
							</table>{{/rebill.shipping_receipts}}    
						  </section>
						  <section id="ip3r2q" style="box-sizing: border-box; text-align: right; max-width: 650px; margin: 10px auto 0; font-size: 20px; padding: 0 10px 10px 0;">Total 
							<span id="i7tugt" style="box-sizing: border-box; font-weight: bold;">\${{order.amount}}</span>
						  </section>
						</div>
					  </td>
					</tr>
				  </tbody>
				</table>
				<div id="iiwi8" style="box-sizing: border-box; padding: 0 0 0 0; font-size: 18px; line-height: 22px; margin: 16px 0 12px 0; text-align: left;">
				  <b id="iji5z" style="box-sizing: border-box;">Customer Information
				  </b>
				</div>
				<table width="100%" height="60" id="i1w3f" style="box-sizing: border-box; height: 60px; width: 100%; font-size: 13px; border: 1px solid rgba(0,0,0,0.12);">
				  <tbody id="i4bi6" style="box-sizing: border-box;">
					<tr id="ir6kji" valign="top" style="box-sizing: border-box; vertical-align: top;">
					  <td id="i2jjhm" width="50%" style="box-sizing: border-box; width: 50%; padding: 30px 0 30px 30px;">
						<section id="customer-shipping-section" tyle="box-sizing: border-box; text-align: left; height: 100%;">
						  <div id="i3os5f" style="box-sizing: border-box; line-height: 24px; font-weight: bold;">Shipping Address
						  </div>
						  <div id="i3l4a2" style="box-sizing: border-box; color: #5F6368;">
							<div id="istxh" style="box-sizing: border-box;">{{customer.firstname}} {{customer.lastname}}
							</div>
							<div id="iauz2" style="box-sizing: border-box;">{{customer.address.line1}}
							</div>
							<div id="ih53x" style="box-sizing: border-box;">{{customer.address.line2}}
							</div>
							<div id="i9h4l" style="box-sizing: border-box;">{{customer.address.city}}, {{customer.address.state}}
							</div>
							<div id="iy1cg" style="box-sizing: border-box;">{{customer.address.zip}}
							</div>
						  </div>
						</section>
					  </td>
					  <td id="iiqavj" width="50%" style="box-sizing: border-box; width: 50%;">
						<section id="customer-billing-section" style="box-sizing: border-box; text-align: left; padding: 30px 30px 30px 0;">
						  <div id="i68b31" style="box-sizing: border-box; line-height: 24px; font-weight: bold;">Billing Information
						  </div>
						  <div id="iu5hp4" style="box-sizing: border-box; color: #5F6368;">
							<div id="i0h0c" style="box-sizing: border-box;">{{creditcard.name}}
							</div>
							<div id="iehj3" style="box-sizing: border-box;">{{creditcard.address.line1}}
							</div>
							<div id="i6y1h" style="box-sizing: border-box;">{{creditcard.address.line2}}
							</div>
							<div id="i9n8k" style="box-sizing: border-box;">{{creditcard.address.city}}, {{creditcard.address.state}}
							</div>
							<div id="ilk5r" style="box-sizing: border-box;">{{creditcard.address.zip}}
							</div>
						  </div>
						  <div id="ifvr2a" style="box-sizing: border-box; margin-top: 12px; line-height: 24px; font-weight: bold;">Payment Method
						  </div>
						  <div id="i1okl3" style="box-sizing: border-box; color: #5F6368;">{{creditcard.type}} ****{{creditcard.last_four}}
						  </div>
						</section>
					  </td>
					</tr>
				  </tbody>
				</table>
			  </td>
			</tr>
		  </tbody>
		</table>
	  </td>
	</tr>
	<tr id="ik7kh" style="box-sizing: border-box; width: 100%; font-size: 12px; color: #5F6368; background: #C4C4C4;">
	  <td id="i567d" align="center" style="box-sizing: border-box; text-align: center; padding: 7px 12px;">
		<div id="iso3d" style="box-sizing: border-box;">If you have any questions about our privacy policy, contact our customer service center via 
		  <a href="mailto:{{accountdetails.support_email}}" id="itsg8" style="box-sizing: border-box;">{{accountdetails.support_email}}</a>
		</div>
	  </td>
	</tr>
  </tbody>
</table>`;
}


function getDefaultAllOrdersTemplateBody(): string {
  return `<table width="100%" style="box-sizing: border-box; width: 100%; font-family: Helvetica, Arial, Verdana, Trebuchet MS;">
  <tbody id="isat6x" style="box-sizing: border-box;">
	<tr id="ii4dh" style="box-sizing: border-box; height: 95px; background: #C4C4C4;">
	  <td id="irrfl" align="center" style="box-sizing: border-box; text-align: center; background: {{accountdetails.emailtemplatesettings.color_primary}};">
		<img src="{{accountdetails.company_logo}}" alt="Company Logo" id="iuzqz" style="box-sizing: border-box; max-height: 60px; min-height: 40px; min-width: 40px; color: #ffffff;">
	  </td>
	</tr>
	<tr id="irtquo" style="box-sizing: border-box;">
	  <td id="i39sy" align="center" style="box-sizing: border-box; text-align: center;">
		<table id="ixqzi" width="100%" style="box-sizing: border-box; width: 100%; max-width: 650px; margin: 25px auto 60px; font-size: 13px;">
		  <tbody id="iig6lq" style="box-sizing: border-box;">
			<tr id="if7y4" style="box-sizing: border-box; height: 100px;">
			  <td id="in2ccq" style="box-sizing: border-box;">
				<section id="title-section" style="box-sizing: border-box; text-align: center;">
				  <div id="in50k" style="box-sizing: border-box; margin-bottom: 12px; font-size: 22px;">Thank you for your order, {{customer.firstname}}!  
				  </div>
				  <div id="irq2q" style="box-sizing: border-box; line-height: 24px; color: #5F6368;">We’re getting your order ready to be shipped. We will notify you once it has been shipped out.  
				  </div>
				</section>
				<div id="ike668" tyle="box-sizing: border-box; padding: 0 10px 0 0; font-size: 18px; line-height: 22px; margin: 16px 0 12px 0; text-align: left;">
				  <b id="i8x4jj" style="box-sizing: border-box;">Order Details  
				  </b>
				</div>
				<table width="100%" height="60" id="i79ck3" style="box-sizing: border-box; height: 60px; width: 100%; font-size: 13px; border: 1px solid rgba(0,0,0,0.12);">
				  <tbody id="iq36nw" style="box-sizing: border-box;">
					<tr id="iraujk" style="box-sizing: border-box;">
					  <td id="iey8k" style="box-sizing: border-box; padding: 0 0 0 0;">
						<section id="order-basic-details-section" style="box-sizing: border-box; max-width: 650px; border-bottom: 1px solid #E5E5E5; margin: 0 auto; padding: 10px 10px 10px 10px;">
						  <table id="ifedw" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; font-weight: bold; color: #202124;">
							<tbody id="i9ja81" style="box-sizing: border-box;">
							  <tr id="ixdry6" style="box-sizing: border-box;">
								<td id="ixg1a" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
								  <div id="izzsfa" style="box-sizing: border-box;">Order ID #{{rebill.alias}}  
								  </div>
								</td>
								<td id="ikk5q" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%;">
								  <div id="itsvwt" style="box-sizing: border-box;">Order placed {{formatDate rebill.bill_at 'MMM D, YYYY'}}  
								  </div>
								</td>
							  </tr>
							</tbody>
						  </table>
						</section>
						<section id="order-products-details-section" style="box-sizing: border-box; max-width: 650px; margin: 0 auto; padding: 0 0 0 0;">{{#rebill.products}}  
						  <table id="ijpss" width="100%" style="box-sizing: border-box; font-size: 13px; border-bottom: 1px solid #E5E5E5; margin: 0 0 0 0; width: 100%;">
							<tbody id="ic1ski" style="box-sizing: border-box;">
							  <tr id="iwfau" style="box-sizing: border-box; padding: 0 10px 0 0;">
								<td id="i6j2i" width="80%" align="left" style="box-sizing: border-box; text-align: left; width: 80%; padding: 10px 0;">
								  <table id="imek3i" style="box-sizing: border-box;">
									<tbody id="inmo7l" style="box-sizing: border-box;">
									  <tr id="i08tpy" style="box-sizing: border-box;">
										<td id="ik5kxq" width="60" style="box-sizing: border-box; width: 60px;">
										  <img src="{{image}}" alt="" id="ik2q9r" style="box-sizing: border-box; min-width: 60px; max-width: 160px; min-height: 60px; background: grey; display: inline-block; margin: 0 0 0 10px;">
										</td>
										<td id="iivorf" style="box-sizing: border-box;">
										  <div id="isn859" style="box-sizing: border-box; margin-left: 30px;">
											<div id="ixr048" style="box-sizing: border-box; line-height: 24px; font-weight: bold; font-size: 18px;">{{product.name}}
											</div>
											<div id="i3xru7" style="box-sizing: border-box; line-height: 24px; color: #5F6368;">QTY: {{quantity}}
											</div>
										  </div>
										</td>
									  </tr>
									</tbody>
								  </table>
								</td>
								<td id="irkb0y" width="20%" align="right" style="box-sizing: border-box; text-align: right; width: 20%; color: #5F6368; font-weight: bold; margin: 0  0 0; padding: 1px 10px 1px 1px;">\${{amount}}
								</td>
							  </tr>
							</tbody>
						  </table>{{/rebill.products}}    
						</section>
						<div id="i33ue7" style="box-sizing: border-box;">
						  <section id="order-pricing--details-section" style="box-sizing: border-box; max-width: 650px; border-bottom: 1px solid #E5E5E5; margin: 0 auto; padding: 10px 10px 10px 10px;">
							<table id="ign7z4" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; color: #5F6368;">
							  <tbody id="ibv3tl" style="box-sizing: border-box;">
								<tr id="i84uln" style="box-sizing: border-box;">
								  <td id="iwxmrd" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
									<div id="i8teki" style="box-sizing: border-box;">Subtotal
									</div>
								  </td>
								  <td id="itw02j" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%; font-weight: bold;">
									<div id="ifk4e9" style="box-sizing: border-box;">\${{rebill.amount}}
									</div>
								  </td>
								</tr>
							  </tbody>
							</table>{{#rebill.shipping_receipts}}
							<table id="irm2ys" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; color: #5F6368;">
							  <tbody id="i1gg8k" style="box-sizing: border-box;">
								<tr id="io8j0u" style="box-sizing: border-box;">
								  <td id="ig5w4g" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
									<div id="ieibse" style="box-sizing: border-box;">Shipping {{tracker.carrier}}
									</div>
								  </td>
								  <td id="i57fa3" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%; font-weight: bold;">
									<div id="io07zp" style="box-sizing: border-box;">\${{amount}}
									</div>
								  </td>
								</tr>
							  </tbody>
							</table>{{/rebill.shipping_receipts}}      
						  </section>
						  <section id="ip3r2q" style="box-sizing: border-box; text-align: right; max-width: 650px; margin: 10px auto 0; font-size: 20px; padding: 0 10px 10px 0;">Total 
							<span id="i7tugt" style="box-sizing: border-box; font-weight: bold;">\${{order.amount}}</span>
						  </section>
						</div>
					  </td>
					</tr>
				  </tbody>
				</table>
				<div id="ikjyhk" style="box-sizing: border-box; padding: 0 0 0 0; font-size: 18px; line-height: 22px; margin: 16px 0 12px 0; text-align: left;">
				  <b id="inew2q" style="box-sizing: border-box;">Customer Information  
				  </b>
				</div>
				<table width="100%" height="60" id="ik114z" style="box-sizing: border-box; height: 60px; width: 100%; font-size: 13px; border: 1px solid rgba(0,0,0,0.12);">
				  <tbody id="isdc2p" style="box-sizing: border-box;">
					<tr id="ir6kji" valign="top" style="box-sizing: border-box; vertical-align: top;">
					  <td id="i2jjhm" width="50%" style="box-sizing: border-box; width: 50%; padding: 30px 0 30px 30px;">
						<section id="customer-shipping-section" style="box-sizing: border-box; text-align: left; height: 100%;">
						  <div id="i3os5f" style="box-sizing: border-box; line-height: 24px; font-weight: bold;">Shipping Address  
						  </div>
						  <div id="i3l4a2" style="box-sizing: border-box; color: #5F6368;">
							<div id="iy9zhu" style="box-sizing: border-box;">{{customer.firstname}} {{customer.lastname}}
							</div>
							<div id="ibcobc" style="box-sizing: border-box;">{{customer.address.line1}}
							</div>
							<div id="ipw4qz" style="box-sizing: border-box;">{{customer.address.line2}}
							</div>
							<div id="iwb70o" style="box-sizing: border-box;">{{customer.address.city}}, {{customer.address.state}}
							</div>
							<div id="iv7vpi" style="box-sizing: border-box;">{{customer.address.zip}}
							</div>
						  </div>
						</section>
					  </td>
					  <td id="iiqavj" width="50%" style="box-sizing: border-box; width: 50%;">
						<section id="customer-billing-section" style="box-sizing: border-box; text-align: left; padding: 30px 30px 30px 0;">
						  <div id="i68b31" style="box-sizing: border-box; line-height: 24px; font-weight: bold;">Billing Information  
						  </div>
						  <div id="iu5hp4" style="box-sizing: border-box; color: #5F6368;">
							<div id="i7nl0i" style="box-sizing: border-box;">{{creditcard.name}}
							</div>
							<div id="ibgh4l" style="box-sizing: border-box;">{{creditcard.address.line1}}
							</div>
							<div id="idzlt5" style="box-sizing: border-box;">{{creditcard.address.line2}}
							</div>
							<div id="ioravl" style="box-sizing: border-box;">{{creditcard.address.city}}, {{creditcard.address.state}}
							</div>
							<div id="inhvaw" style="box-sizing: border-box;">{{creditcard.address.zip}}
							</div>
						  </div>
						  <div id="ifvr2a" style="box-sizing: border-box; margin-top: 12px; line-height: 24px; font-weight: bold;">Payment Method  
						  </div>
						  <div id="i1okl3" style="box-sizing: border-box; color: #5F6368;">{{creditcard.type}} ****{{creditcard.last_four}}  
						  </div>
						</section>
					  </td>
					</tr>
				  </tbody>
				</table>
			  </td>
			</tr>
		  </tbody>
		</table>
	  </td>
	</tr>
	<tr id="ik7kh" style="box-sizing: border-box; width: 100%; font-size: 12px; color: #5F6368; background: #C4C4C4;">
	  <td id="i567d" align="center" style="box-sizing: border-box; text-align: center; padding: 7px 12px;">
		<div id="ipu2az" style="box-sizing: border-box;">If you have any questions about our privacy policy, contact our customer service center via   
		  <a href="mailto:{{accountdetails.support_email}}" id="idcf5j" style="box-sizing: border-box;">{{accountdetails.support_email}}</a>
		</div>
	  </td>
	</tr>
  </tbody>
</table>`;
}

function getDefaultRefundTemplateBody(): string {
  return `<table width="100%" style="box-sizing: border-box; width: 100%; font-family: Helvetica, Arial, Verdana, Trebuchet MS;">
  <tbody id="ixo5r" style="box-sizing: border-box;">
	<tr id="ii4dh" style="box-sizing: border-box; height: 95px; background: #C4C4C4;">
	  <td id="irrfl" align="center" style="box-sizing: border-box; text-align: center; background: {{accountdetails.emailtemplatesettings.color_primary}};">
		<img src="{{accountdetails.company_logo}}" alt="Company Logo" id="iuzqz" style="box-sizing: border-box; max-height: 60px; min-height: 40px; min-width: 40px; color: #ffffff;">
	  </td>
	</tr>
	<tr id="ivphd" style="box-sizing: border-box;">
	  <td id="i39sy" align="center" style="box-sizing: border-box; text-align: center;">
		<table id="ixqzi" width="100%" style="box-sizing: border-box; width: 100%; max-width: 650px; margin: 25px auto 60px; font-size: 13px;">
		  <tbody id="imkek" style="box-sizing: border-box;">
			<tr id="if7y4" style="box-sizing: border-box; height: 100px;">
			  <td id="ib25k" style="box-sizing: border-box;">
				<section id="title-section" style="box-sizing: border-box; text-align: center;">
				  <div id="ifn1wg" style="box-sizing: border-box; margin-bottom: 12PX; font-size: 22px;">Your refund has been processed.
				  </div>
				  <div id="if23ds" style="box-sizing: border-box; line-height: 24px; color: #5F6368;">Transaction #{{transaction.alias}} was refunded for 
					<b id="i1rcpl" data-highlightable="1" style="box-sizing: border-box; color: #1EBEA5;">\${{refund.amount}}
					</b> on {{formatDate refund.created_at 'MMM D, YYYY'}}
				  </div>
				</section>
				<div id="i3tt6" style="box-sizing: border-box; padding: 0 10px 0 0; font-size: 18px; line-height: 22px; margin: 16px 0 12px 0; text-align: left;">
				  <b id="i1wve" style="box-sizing: border-box;">Order Details    
				  </b>
				</div>
				<table width="100%" height="60" id="if8a8" style="box-sizing: border-box; height: 60px; width: 100%; font-size: 13px; border: 1px solid rgba(0,0,0,0.12);">
				  <tbody id="ilnqo" style="box-sizing: border-box;">
					<tr id="i8muv" style="box-sizing: border-box;">
					  <td id="iey8k" style="box-sizing: border-box; padding: 0 0 0 0;">
						<section id="order-basic-details-section" style="box-sizing: border-box; max-width: 650px; border-bottom: 1px solid #E5E5E5; margin: 0 auto; padding: 10px 10px 10px 10px;">
						  <table id="ifedw" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; font-weight: bold; color: #202124;">
							<tbody id="izwkh" style="box-sizing: border-box;">
							  <tr id="i4rdj" style="box-sizing: border-box;">
								<td id="ixg1a" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
								  <div id="irvna" style="box-sizing: border-box;">Order ID #{{rebill.alias}}
								  </div>
								</td>
								<td id="ikk5q" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%;">
								  <div id="i5nze" style="box-sizing: border-box;">Order placed {{formatDate rebill.bill_at 'MMM D, YYYY'}}
								  </div>
								</td>
							  </tr>
							</tbody>
						  </table>
						</section>
						<section id="order-products-details-section" style="box-sizing: border-box; max-width: 650px; margin: 0 auto; padding: 0 0 0 0;">{{#rebill.products}}
						  <table id="ijpss" width="100%" style="box-sizing: border-box; font-size: 13px; border-bottom: 1px solid #E5E5E5; margin: 0 0 0 0; width: 100%;">
							<tbody id="ii9sg" style="box-sizing: border-box;">
							  <tr id="iwfau" style="box-sizing: border-box; padding: 0 10px 0 0;">
								<td id="i6j2i" width="80%" align="left" style="box-sizing: border-box; text-align: left; width: 80%; padding: 10px 0;">
								  <table id="ig3ik" style="box-sizing: border-box;">
									<tbody id="i14nt" style="box-sizing: border-box;">
									  <tr id="if8g3" style="box-sizing: border-box;">
										<td id="ik5kxq" width="60" style="box-sizing: border-box; width: 60px;">
										  <img src="{{image}}" alt="" id="ik2q9r" style="box-sizing: border-box; min-width: 60px; max-width: 160px; min-height: 60px; background: grey; display: inline-block; margin: 0 0 0 10px;">
										</td>
										<td id="irird" style="box-sizing: border-box;">
										  <div id="isn859" style="box-sizing: border-box; margin-left: 30px;">
											<div id="ixr048" style="box-sizing: border-box; line-height: 24px; font-weight: bold; font-size: 18px;">{{product.name}}
											</div>
											<div id="i3xru7" style="box-sizing: border-box; line-height: 24px; color: #5F6368;">QTY: {{quantity}}
											</div>
										  </div>
										</td>
									  </tr>
									</tbody>
								  </table>
								</td>
								<td id="irkb0y" width="20%" align="right" style="box-sizing: border-box; text-align: right; width: 20%; color: #5F6368; font-weight: bold; margin: 0  0 0; padding: 1px 10px 1px 1px;">\${{amount}}
								</td>
							  </tr>
							</tbody>
						  </table> {{/rebill.products}}    
						</section>
						<div id="i0wpl" style="box-sizing: border-box;">
						  <section id="order-pricing--details-section" style="box-sizing: border-box; max-width: 650px; border-bottom: 1px solid #E5E5E5; margin: 0 auto; padding: 10px 10px 10px 10px;">
							<table id="ign7z4" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; color: #5F6368;">
							  <tbody id="id80e" style="box-sizing: border-box;">
								<tr id="imtfn" style="box-sizing: border-box;">
								  <td id="iwxmrd" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
									<div id="iq4yw" style="box-sizing: border-box;">Subtotal
									</div>
								  </td>
								  <td id="itw02j" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%; font-weight: bold;">
									<div id="it6w6" style="box-sizing: border-box;">\${{rebill.amount}}
									</div>
								  </td>
								</tr>
							  </tbody>
							</table>{{#rebill.shipping_receipts}}
							<table id="irm2ys" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; color: #5F6368;">
							  <tbody id="iz5l7" style="box-sizing: border-box;">
								<tr id="idly9" style="box-sizing: border-box;">
								  <td id="ig5w4g" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
									<div id="i8k0o" style="box-sizing: border-box;">Shipping {{tracker.carrier}}
									</div>
								  </td>
								  <td id="i57fa3" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%; font-weight: bold;">
									<div id="iepgg" style="box-sizing: border-box;">\${{amount}}
									</div>
								  </td>
								</tr>
							  </tbody>
							</table>{{/rebill.shipping_receipts}}
						  </section>
						  <section id="ip3r2q" style="box-sizing: border-box; text-align: right; max-width: 650px; margin: 10px auto 0; font-size: 20px; padding: 0 10px 10px 0; color: #1EBEA5;">Total refunded
							<span id="i7tugt" data-highlightable="1" style="box-sizing: border-box; font-weight: bold;">\${{refund.amount}}</span>
						  </section>
						</div>
					  </td>
					</tr>
				  </tbody>
				</table>
				<div id="iomxh" style="box-sizing: border-box; padding: 0 0 0 0; font-size: 18px; line-height: 22px; margin: 16px 0 12px 0; text-align: left;">
				  <b id="is5m5v" style="box-sizing: border-box;">Customer Information    
				  </b>
				</div>
				<table width="100%" height="60" id="i68nfj" style="box-sizing: border-box; height: 60px; width: 100%; font-size: 13px; border: 1px solid rgba(0,0,0,0.12);">
				  <tbody id="iuox2l" style="box-sizing: border-box;">
					<tr id="ir6kji" valign="top" style="box-sizing: border-box; vertical-align: top;">
					  <td id="i2jjhm" width="50%" style="box-sizing: border-box; width: 50%; padding: 30px 0 30px 30px;">
						<section id="customer-shipping-section" style="box-sizing: border-box; text-align: left; height: 100%;">
						  <div id="i3os5f" style="box-sizing: border-box; line-height: 24px; font-weight: bold;">Shipping Address    
						  </div>
						  <div id="i3l4a2" style="box-sizing: border-box; color: #5F6368;">
							<div id="ihqkfl" style="box-sizing: border-box;">{{customer.firstname}} {{customer.lastname}}
							</div>
							<div id="iayjyo" style="box-sizing: border-box;">{{customer.address.line1}}
							</div>
							<div id="ixmxb8" style="box-sizing: border-box;">{{customer.address.line2}}
							</div>
							<div id="idbeff" style="box-sizing: border-box;">{{customer.address.city}}, {{customer.address.state}}
							</div>
							<div id="ivzjau" style="box-sizing: border-box;">{{customer.address.zip}}
							</div>
						  </div>
						</section>
					  </td>
					  <td id="iiqavj" width="50%" style="box-sizing: border-box; width: 50%;">
						<section id="customer-billing-section" style="box-sizing: border-box; text-align: left; padding: 30px 30px 30px 0;">
						  <div id="i68b31" style="box-sizing: border-box; line-height: 24px; font-weight: bold;">Billing Information    
						  </div>
						  <div id="iu5hp4" style="box-sizing: border-box; color: #5F6368;">
							<div id="ietopg" style="box-sizing: border-box;">{{creditcard.name}}
							</div>
							<div id="i097jh" style="box-sizing: border-box;">{{creditcard.address.line1}}
							</div>
							<div id="iedm5m" style="box-sizing: border-box;">{{creditcard.address.line2}}
							</div>
							<div id="ijvv6g" style="box-sizing: border-box;">{{creditcard.address.city}}, {{creditcard.address.state}}
							</div>
							<div id="i9uw7w" style="box-sizing: border-box;">{{creditcard.address.zip}}
							</div>
						  </div>
						  <div id="ifvr2a" style="box-sizing: border-box; margin-top: 12px; line-height: 24px; font-weight: bold;">Payment Method    
						  </div>
						  <div id="i1okl3" style="box-sizing: border-box; color: #5F6368;">{{creditcard.type}} ****{{creditcard.last_four}}    
						  </div>
						</section>
					  </td>
					</tr>
				  </tbody>
				</table>
			  </td>
			</tr>
		  </tbody>
		</table>
	  </td>
	</tr>
	<tr id="ik7kh" style="box-sizing: border-box; width: 100%; font-size: 12px; color: #5F6368; background: #C4C4C4;">
	  <td id="i567d" align="center" style="box-sizing: border-box; text-align: center; padding: 7px 12px;">
		<div id="ikx6jz" style="box-sizing: border-box;">If you have any questions about our privacy policy, contact our customer service center via     
		  <a href="mailto:{{accountdetails.support_email}}" id="ihi6hl" style="box-sizing: border-box;">{{accountdetails.support_email}}</a>
		</div>
	  </td>
	</tr>
  </tbody>
</table>`;
}

function getDefaultReturnTemplateBody(): string {
  return `<table width="100%" style="box-sizing: border-box; width: 100%; font-family: Helvetica, Arial, Verdana, Trebuchet MS;">
  <tbody id="i0umbz" style="box-sizing: border-box;">
	<tr id="ii4dh" style="box-sizing: border-box; height: 95px; background: #C4C4C4;">
	  <td id="irrfl" align="center" style="box-sizing: border-box; text-align: center; background: {{accountdetails.emailtemplatesettings.color_primary}};">
		<img src="{{accountdetails.company_logo}}" alt="Company Logo" id="iuzqz" style="box-sizing: border-box; max-height: 60px; min-height: 40px; min-width: 40px; color: #ffffff;">
	  </td>
	</tr>
	<tr id="ivaszz" style="box-sizing: border-box;">
	  <td id="i39sy" align="center" style="box-sizing: border-box; text-align: center;">
		<table id="ixqzi" width="100%" style="box-sizing: border-box; width: 100%; max-width: 650px; margin: 25px auto 60px; font-size: 13px;">
		  <tbody id="iknpw5" style="box-sizing: border-box;">
			<tr id="if7y4" style="box-sizing: border-box; height: 100px;">
			  <td id="ipewug" style="box-sizing: border-box;">
				<section id="title-section" style="box-sizing: border-box; text-align: center;">
				  <div id="is53eh" style="box-sizing: border-box; margin-bottom: 12px; font-size: 22px;">Your return has been processed.  
				  </div>
				  <div id="il9p18" style="box-sizing: border-box; line-height: 24px; color: #5F6368;">We have received the items from 
					<b id="igowvi" style="box-sizing: border-box;">Order #{{rebill.alias}} 
					</b>and have processed your return.
					<div id="iprfvq" style="box-sizing: border-box;">You will receive a separate message when refund for this purchase has been completed.
					</div>
				  </div>
				</section>
				<div id="ikyrfj" style="box-sizing: border-box; padding: 0 10px 0 0; font-size: 18px; line-height: 22px; margin: 16px 0 12px 0; text-align: left;">
				  <b id="idkssy" style="box-sizing: border-box;">Return Details      
				  </b>
				</div>
				<section id="order-products-details-section" style="box-sizing: border-box; max-width: 650px; margin: 0 auto; border: 1px solid rgba(0,0,0,0.12);">{{#return.transactions}}{{#products}}  
				  <table id="i9j57" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; border-bottom: 1px solid #E5E5E5;">
					<tbody id="inw1g" style="box-sizing: border-box;">
					  <tr id="imwad" style="box-sizing: border-box;">
						<td id="in415" width="80%" align="left" style="box-sizing: border-box; text-align: left; width: 80%; padding: 10px 0;">
						  <table id="ixr1i" style="box-sizing: border-box;">
							<tbody id="ih07e" style="box-sizing: border-box;">
							  <tr id="i2e2s" style="box-sizing: border-box;">
								<td id="i2uxc" width="60" style="box-sizing: border-box; width: 60px;">
								  <img src="{{image}}" alt="" id="i75yd" style="box-sizing: border-box; min-width: 60px; max-width: 160px; min-height: 60px; background: grey; display: inline-block; margin: 0 0 0 10px;">
								</td>
								<td id="id1ua" style="box-sizing: border-box;">
								  <div id="ink9e" style="box-sizing: border-box; margin-left: 30px;">
									<div id="i75h4" style="box-sizing: border-box; line-height: 24px; font-weight: bold; font-size: 18px;">{{product.name}}
									</div>
									<div id="i68tp" style="box-sizing: border-box; line-height: 24px; color: #5F6368;">QTY: {{quantity}}
									</div>
								  </div>
								</td>
							  </tr>
							</tbody>
						  </table>
						</td>
						<td id="ibvkc" width="20%" align="right" style="box-sizing: border-box; text-align: right; width: 20%; color: #5F6368; font-weight: bold; padding: 1px 10px 1px 1px;">\${{product.default_price}}
						</td>
					  </tr>
					</tbody>
				  </table>{{/products}}{{/return.transactions}}    
				</section>
				<div id="igick8" style="box-sizing: border-box; padding: 0 0 0 0; font-size: 18px; line-height: 22px; margin: 16px 0 12px 0; text-align: left;">
				  <b id="iz1smi" style="box-sizing: border-box;">Customer Information      
				  </b>
				</div>
				<table width="100%" height="60" id="idl2yp" style="box-sizing: border-box; height: 60px; width: 100%; font-size: 13px; border: 1px solid rgba(0,0,0,0.12);">
				  <tbody id="i3hv9l" style="box-sizing: border-box;">
					<tr id="ir6kji" valign="top" style="box-sizing: border-box; vertical-align: top;">
					  <td id="i2jjhm" width="50%" style="box-sizing: border-box; width: 50%; padding: 30px 0 30px 30px;">
						<section id="customer-shipping-section" style="box-sizing: border-box; text-align: left; height: 100%;">
						  <div id="i3os5f" style="box-sizing: border-box; line-height: 24px; font-weight: bold;">Shipping Address      
						  </div>
						  <div id="i3l4a2" style="box-sizing: border-box; color: #5F6368;">
							<div id="ii1yqn" style="box-sizing: border-box;">{{customer.firstname}} {{customer.lastname}}
							</div>
							<div id="iytmvf" style="box-sizing: border-box;">{{customer.address.line1}}
							</div>
							<div id="idmi3i" style="box-sizing: border-box;">{{customer.address.line2}}
							</div>
							<div id="ill6gy" style="box-sizing: border-box;">{{customer.address.city}}, {{customer.address.state}}
							</div>
							<div id="iq1qve" style="box-sizing: border-box;">{{customer.address.zip}}
							</div>
						  </div>
						</section>
					  </td>
					  <td id="iiqavj" width="50%" style="box-sizing: border-box; width: 50%;">
						<section id="customer-billing-section" style="box-sizing: border-box; text-align: left; padding: 30px 30px 30px 0;">
						  <div id="i68b31" style="box-sizing: border-box; line-height: 24px; font-weight: bold;">Billing Information      
						  </div>
						  <div id="iu5hp4" style="box-sizing: border-box; color: #5F6368;">
							<div id="ie80d6" style="box-sizing: border-box;">{{creditcard.name}}
							</div>
							<div id="ibaxdy" style="box-sizing: border-box;">{{creditcard.address.line1}}
							</div>
							<div id="ifnn7k" style="box-sizing: border-box;">{{creditcard.address.line2}}
							</div>
							<div id="imafyu" style="box-sizing: border-box;">{{creditcard.address.city}}, {{creditcard.address.state}}
							</div>
							<div id="i1f2pk" style="box-sizing: border-box;">{{creditcard.address.zip}}
							</div>
						  </div>
						  <div id="ifvr2a" style="box-sizing: border-box; margin-top: 12px; line-height: 24px; font-weight: bold;">Payment Method      
						  </div>
						  <div id="i1okl3" style="box-sizing: border-box; color: #5F6368;">{{creditcard.type}} ****{{creditcard.last_four}}      
						  </div>
						</section>
					  </td>
					</tr>
				  </tbody>
				</table>
			  </td>
			</tr>
		  </tbody>
		</table>
	  </td>
	</tr>
	<tr id="ik7kh" style="box-sizing: border-box; width: 100%; font-size: 12px; color: #5F6368; background: #C4C4C4;">
	  <td id="i567d" align="center" style="box-sizing: border-box; text-align: center; padding: 7px 12px;">
		<div id="itn2zy" style="box-sizing: border-box;">If you have any questions about our privacy policy, contact our customer service center via       
		  <a href="mailto:{{accountdetails.support_email}}" id="iyhun8" style="box-sizing: border-box;">{{accountdetails.support_email}}</a>
		</div>
	  </td>
	</tr>
  </tbody>
</table>`;
}

function getDefaultCancellationTemplateBody(): string {
  return `<table width="100%" style="box-sizing: border-box; width: 100%; font-family: Helvetica, Arial, Verdana, Trebuchet MS;">
  <tbody id="i00v" style="box-sizing: border-box;">
	<tr id="i8lm78" style="box-sizing: border-box; height: 95px; background: #C4C4C4;">
	  <td id="id67dr" align="center" style="box-sizing: border-box; text-align: center; background: {{accountdetails.emailtemplatesettings.color_primary}};">
		<img src="{{accountdetails.company_logo}}" alt="Company Logo" id="iom2al" style="box-sizing: border-box; max-height: 60px; min-height: 40px; min-width: 40px; color: #ffffff;">
	  </td>
	</tr>
	<tr id="i7ny" style="box-sizing: border-box;">
	  <td id="i6bj8a" align="center" style="box-sizing: border-box; text-align: center;">
		<table id="i00vz7" width="100%" style="box-sizing: border-box; width: 100%; max-width: 650px; margin: 25px auto 60px; font-size: 13px;">
		  <tbody id="illui" style="box-sizing: border-box;">
			<tr id="im03yh" style="box-sizing: border-box; height: 100px;">
			  <td id="i16gg" style="box-sizing: border-box;">
				<section id="title-section" style="box-sizing: border-box; text-align: center;">
				  <div id="imvhr" style="box-sizing: border-box; margin-bottom: 12px; font-size: 22px; color: #FC1F49;">Your order has been cancelled.
				  </div>
				  <div id="iz8kk" style="box-sizing: border-box; line-height: 24px; color: #5F6368; margin: 0 0 20px 0;">This is to confirm that you order #{{session.alias}} has been cancelled.
				  </div>
				</section>
				<section id="order-products-details-section" style="box-sizing: border-box; max-width: 650px; margin: 0 auto;">  {{#session.watermark.product_schedules}}      
				  <table id="ip6v1l" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; border-bottom: 1px solid #E5E5E5;">
					<tbody id="igmdgj" style="box-sizing: border-box;">
					  <tr id="ip0mm5" style="box-sizing: border-box;">
						<td id="iy5bq8" width="80%" align="left" style="box-sizing: border-box; text-align: left; width: 80%; padding: 10px 0;">
						  <table id="iu31xi" style="box-sizing: border-box;">
							<tbody id="iwtpqh" style="box-sizing: border-box;">
							  <tr id="i27qtf" style="box-sizing: border-box;">
								<td id="ia0apl" style="box-sizing: border-box;">
								  <div id="i5udre" style="box-sizing: border-box; margin-left: 30px;">
									<div id="iurva5" style="box-sizing: border-box; line-height: 24px; font-weight: bold; font-size: 18px;">{{product_schedule.name}}
									</div>
									<div id="iq1c6i" style="box-sizing: border-box; line-height: 24px; color: #5F6368;">QTY: {{quantity}}
									</div>
								  </div>
								</td>
							  </tr>
							</tbody>
						  </table>
						</td>
						<td width="20%" align="right" id="ifdbu1" style="box-sizing: border-box; text-align: right; width: 20%; color: #5F6368; font-weight: bold;">Subscription
						</td>
					  </tr>
					</tbody>
				  </table>  {{/session.watermark.product_schedules}}
				</section>
				<section id="order-products-details-section" style="box-sizing: border-box; max-width: 650px; margin: 0 auto;">  {{#session.watermark.products}}    
				  <table id="imfarb" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; border-bottom: 1px solid #E5E5E5;">
					<tbody id="iof2g7" style="box-sizing: border-box;">
					  <tr id="i4t34j" style="box-sizing: border-box;">
						<td id="itlrqe" width="80%" align="left" style="box-sizing: border-box; text-align: left; width: 80%; padding: 10px 0;">
						  <table id="iwwahd" style="box-sizing: border-box;">
							<tbody id="iabzfg" style="box-sizing: border-box;">
							  <tr id="ioui11" style="box-sizing: border-box;">
								<td id="i7uyif" style="box-sizing: border-box;">
								  <div id="iiw1ef" style="box-sizing: border-box; margin-left: 30px;">
									<div id="i1an2l" style="box-sizing: border-box; line-height: 24px; font-weight: bold; font-size: 18px;">{{product.name}}
									</div>
									<div id="i8lhj5" style="box-sizing: border-box; line-height: 24px; color: #5F6368;">QTY: {{quantity}}
									</div>
								  </div>
								</td>
							  </tr>
							</tbody>
						  </table>
						</td>
						<td id="ixr37a" width="20%" align="right" style="box-sizing: border-box; text-align: right; width: 20%; color: #5F6368; font-weight: bold;">\${{price}}
						</td>
					  </tr>
					</tbody>
				  </table>  {{/session.watermark.products}}
				</section>
				<div id="i09ug" style="box-sizing: border-box; padding: 10px; text-align: center; color: #5F6368; font-weight: 700; margin: 60px 0 0 0;">If you did not request this cancellation, or if there is anything we can do to help, please don't hesitate to contact us at {{accountdetails.support_email}}
				</div>
			  </td>
			</tr>
		  </tbody>
		</table>
	  </td>
	</tr>
	<tr id="ikh60z" style="box-sizing: border-box; width: 100%; font-size: 12px; color: #5F6368; background: #C4C4C4;">
	  <td id="i96arz" align="center" style="box-sizing: border-box; text-align: center; padding: 7px 12px;">
		<div id="ib48y" style="box-sizing: border-box;">If you have any questions about our privacy policy, contact our customer service center via 
		  <a href="mailto:{{accountdetails.support_email}}" id="ikkxh" style="box-sizing: border-box;">{{accountdetails.support_email}}</a>
		</div>
	  </td>
	</tr>
  </tbody>
</table>`;
}

function getDefaultDeclinesTemplateBody(): string {
  return `<table width="100%" style="width: 100%; font-family: Helvetica, Arial, Verdana, Trebuchet MS; box-sizing: border-box; margin: 0 auto; padding: 0 0 0 0;">
  <tbody id="irsl" style="box-sizing: border-box;">
	<tr id="ii4dh" style="box-sizing: border-box; height: 95px; background: #C4C4C4;">
	  <td id="irrfl" align="center" style="box-sizing: border-box; text-align: center; background: {{accountdetails.emailtemplatesettings.color_primary}};">
		<img src="{{accountdetails.company_logo}}" alt="Company Logo" id="iuzqz" style="box-sizing: border-box; max-height: 60px; min-height: 40px; min-width: 40px; color: #ffffff;">
	  </td>
	</tr>
	<tr id="i5kz" style="box-sizing: border-box;">
	  <td id="i39sy" align="center" style="box-sizing: border-box; text-align: center;">
		<table id="ixqzi" width="100%" style="box-sizing: border-box; width: 100%; max-width: 650px; margin: 25px auto 60px; font-size: 13px;">
		  <tbody id="ifhbk" style="box-sizing: border-box;">
			<tr id="if7y4" style="box-sizing: border-box; height: 100px;">
			  <td id="iyxoz" style="box-sizing: border-box;">
				<section id="title-section" style="box-sizing: border-box; text-align: center;">
				  <div id="ivvu5m" style="box-sizing: border-box; margin-bottom: 12px; font-size: 22px; color: #FC1F49; font-weight: 700;">Your payment has been declined.
				  </div>
				  <div id="iukpp6" style="box-sizing: border-box; line-height: 24px; color: #5F6368;">On {{formatDate transaction.created_at 'MM/DD/YYYY'}}, we attempted to charge \${{transaction.amount}} to your {{transaction.credit_card.type}} card ending in {{transaction.credit_card.last_four}}, however the payment was unsuccessful.
					<div id="igxx0h" style="box-sizing: border-box; font-weight: bold;">  Please contact our customer support at {{accountdetails.support_email}} to fix your payment information and continue your order.
					</div>
				  </div>
				</section>
				<div id="i8o1g" style="box-sizing: border-box; padding: 0 10px 0 0; font-size: 18px; line-height: 22px; margin: 16px 0 12px 0; text-align: left;">
				  <b id="i2quf" style="box-sizing: border-box;">Order Details    
				  </b>
				</div>
				<table width="100%" height="60" id="isbj9" style="box-sizing: border-box; height: 60px; width: 100%; font-size: 13px; border: 1px solid rgba(0,0,0,0.12);">
				  <tbody id="iz4hu" style="box-sizing: border-box;">
					<tr id="i0yln" style="box-sizing: border-box;">
					  <td id="iey8k" style="box-sizing: border-box; padding: 0 0 0 0;">
						<section id="order-basic-details-section" style="box-sizing: border-box; max-width: 650px; border-bottom: 1px solid #E5E5E5; margin: 0 auto; padding: 10px 10px 10px 10px;">
						  <table id="ifedw" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; font-weight: bold; color: #202124;">
							<tbody id="iob27" style="box-sizing: border-box;">
							  <tr id="id17x" style="box-sizing: border-box;">
								<td id="ixg1a" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
								  <div id="ina21" style="box-sizing: border-box;">Order ID #{{rebill.alias}}
								  </div>
								</td>
								<td id="ikk5q" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%;">
								  <div id="iwxtu" style="box-sizing: border-box;">Order placed {{formatDate rebill.bill_at 'MMM D, YYYY'}}
								  </div>
								</td>
							  </tr>
							</tbody>
						  </table>
						</section>
						<section id="order-products-details-section" style="box-sizing: border-box; max-width: 650px; margin: 0 auto; padding: 0 0 0 0;">{{#rebill.products}}
						  <table id="ijpss" width="100%" style="box-sizing: border-box; font-size: 13px; border-bottom: 1px solid #E5E5E5; margin: 0 0 0 0; width: 100%;">
							<tbody id="i4xhe" style="box-sizing: border-box;">
							  <tr id="iwfau" style="box-sizing: border-box; padding: 0 10px 0 0;">
								<td id="i6j2i" width="80%" align="left" style="box-sizing: border-box; text-align: left; width: 80%; padding: 10px 0;">
								  <table id="i33qg" style="box-sizing: border-box;">
									<tbody id="iskzx" style="box-sizing: border-box;">
									  <tr id="id9ui" style="box-sizing: border-box;">
										<td id="ik5kxq" width="60" style="box-sizing: border-box; width: 60px;">
										  <img src="{{image}}" alt="" id="ik2q9r" style="box-sizing: border-box; min-width: 60px; max-width: 160px; min-height: 60px; background: grey; display: inline-block; margin: 0 0 0 10px;">
										</td>
										<td id="ifvnu" style="box-sizing: border-box;">
										  <div id="isn859" style="box-sizing: border-box; margin-left: 30px;">
											<div id="ixr048" style="box-sizing: border-box; line-height: 24px; font-weight: bold; font-size: 18px;">{{product.name}}
											</div>
											<div id="i3xru7" style="box-sizing: border-box; line-height: 24px; color: #5F6368;">QTY: {{quantity}}
											</div>
										  </div>
										</td>
									  </tr>
									</tbody>
								  </table>
								</td>
								<td id="irkb0y" width="20%" align="right" style="box-sizing: border-box; text-align: right; width: 20%; color: #5F6368; font-weight: bold; margin: 0  0 0; padding: 1px 10px 1px 1px;">\${{amount}}
								</td>
							  </tr>
							</tbody>
						  </table>{{/rebill.products}}    
						</section>
						<div id="imgz8" style="box-sizing: border-box;">
						  <section id="order-pricing--details-section" style="box-sizing: border-box; max-width: 650px; border-bottom: 1px solid #E5E5E5; margin: 0 auto; padding: 10px 10px 10px 10px;">
							<table id="ign7z4" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; color: #5F6368;">
							  <tbody id="in0pf" style="box-sizing: border-box;">
								<tr id="i1ldm" style="box-sizing: border-box;">
								  <td id="iwxmrd" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
									<div id="i2m6v" style="box-sizing: border-box;">Subtotal
									</div>
								  </td>
								  <td id="itw02j" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%; font-weight: bold;">
									<div id="i333o" style="box-sizing: border-box;">\${{rebill.amount}}
									</div>
								  </td>
								</tr>
							  </tbody>
							</table>{{#rebill.shipping_receipts}}
							<table id="irm2ys" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; color: #5F6368;">
							  <tbody id="imu5x" style="box-sizing: border-box;">
								<tr id="ilku7" style="box-sizing: border-box;">
								  <td id="ig5w4g" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
									<div id="i0b2j" style="box-sizing: border-box;">Shipping {{tracker.carrier}}
									</div>
								  </td>
								  <td id="i57fa3" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%; font-weight: bold;">
									<div id="if9zc" style="box-sizing: border-box;">\${{amount}}
									</div>
								  </td>
								</tr>
							  </tbody>
							</table>{{/rebill.shipping_receipts}}
						  </section>
						  <section id="ip3r2q" style="box-sizing: border-box; text-align: right; max-width: 650px; margin: 10px auto 0; font-size: 20px; padding: 0 10px 10px 0;">Total 
							<span id="i7tugt" style="box-sizing: border-box; font-weight: bold;">\${{order.amount}}</span>
						  </section>
						</div>
					  </td>
					</tr>
				  </tbody>
				</table>
				<div id="ibel8" style="box-sizing: border-box; padding: 0 0 0 0; font-size: 18px; line-height: 22px; margin: 16px 0 12px 0; text-align: left;">
				  <b id="i0ggn" style="box-sizing: border-box;">Customer Information    
				  </b>
				</div>
				<table width="100%" height="60" id="i8qvl" style="box-sizing: border-box; height: 60px; width: 100%; font-size: 13px; border: 1px solid rgba(0,0,0,0.12);">
				  <tbody id="is9py" style="box-sizing: border-box;">
					<tr id="ir6kji" valign="top" style="box-sizing: border-box; vertical-align: top;">
					  <td id="i2jjhm" width="50%" style="box-sizing: border-box; width: 50%; padding: 30px 0 30px 30px;">
						<section id="customer-shipping-section" style="box-sizing: border-box; text-align: left; height: 100%;">
						  <div id="i3os5f" style="box-sizing: border-box; line-height: 24px; font-weight: bold;">Shipping Address    
						  </div>
						  <div id="i3l4a2" style="box-sizing: border-box; color: #5F6368;">
							<div id="ika0l" style="box-sizing: border-box;">{{customer.firstname}} {{customer.lastname}}
							</div>
							<div id="i4u3g" style="box-sizing: border-box;">{{customer.address.line1}}
							</div>
							<div id="i5sa8" style="box-sizing: border-box;">{{customer.address.line2}}
							</div>
							<div id="ira6d" style="box-sizing: border-box;">{{customer.address.city}}, {{customer.address.state}}
							</div>
							<div id="i0old" style="box-sizing: border-box;">{{customer.address.zip}}
							</div>
						  </div>
						</section>
					  </td>
					  <td id="iiqavj" width="50%" style="box-sizing: border-box; width: 50%;">
						<section id="customer-billing-section" style="box-sizing: border-box; text-align: left; padding: 30px 30px 30px 0;">
						  <div id="i68b31" style="box-sizing: border-box; line-height: 24px; font-weight: bold;">Billing Information    
						  </div>
						  <div id="iu5hp4" style="box-sizing: border-box; color: #5F6368;">
							<div id="iizij" style="box-sizing: border-box;">{{creditcard.name}}
							</div>
							<div id="ipxoo" style="box-sizing: border-box;">{{creditcard.address.line1}}
							</div>
							<div id="ibxkv" style="box-sizing: border-box;">{{creditcard.address.line2}}
							</div>
							<div id="i6e74" style="box-sizing: border-box;">{{creditcard.address.city}}, {{creditcard.address.state}}
							</div>
							<div id="i3pcs" style="box-sizing: border-box;">{{creditcard.address.zip}}
							</div>
						  </div>
						  <div id="ifvr2a" style="box-sizing: border-box; margin-top: 12px; line-height: 24px; font-weight: bold;">Payment Method    
						  </div>
						  <div id="i1okl3" style="box-sizing: border-box; color: #5F6368;">{{creditcard.type}} ****{{creditcard.last_four}}    
						  </div>
						</section>
					  </td>
					</tr>
				  </tbody>
				</table>
			  </td>
			</tr>
		  </tbody>
		</table>
	  </td>
	</tr>
	<tr id="ik7kh" style="box-sizing: border-box; width: 100%; font-size: 12px; color: #5F6368; background: #C4C4C4;">
	  <td id="i567d" align="center" style="box-sizing: border-box; text-align: center; padding: 7px 12px;">
		<div id="ius4s" style="box-sizing: border-box;">If you have any questions about our privacy policy, contact our customer service center via     
		  <a href="mailto:{{accountdetails.support_email}}" id="ix186" style="box-sizing: border-box;">{{accountdetails.support_email}}</a>
		</div>
	  </td>
	</tr>
  </tbody>
</table>`;
}

function getDefaultInitialFulfillmentTemplateBody(): string {
  return `<table width="100%" style="box-sizing: border-box; width: 100%; font-family: Helvetica, Arial, Verdana, Trebuchet MS;">
  <tbody id="ib4f" style="box-sizing: border-box;">
	<tr id="ii4dh" style="box-sizing: border-box; height: 95px; background: #C4C4C4;">
	  <td id="irrfl" align="center" style="box-sizing: border-box; text-align: center; background: {{accountdetails.emailtemplatesettings.color_primary}};">
		<img src="{{accountdetails.company_logo}}" alt="Company Logo" id="iuzqz" style="box-sizing: border-box; max-height: 60px; min-height: 40px; min-width: 40px; color: #ffffff;">
	  </td>
	</tr>
	<tr id="irpi" style="box-sizing: border-box;">
	  <td id="i39sy" align="center" style="box-sizing: border-box; text-align: center;">
		<table id="ixqzi" width="100%" style="box-sizing: border-box; width: 100%; max-width: 650px; margin: 25px auto 60px; font-size: 13px;">
		  <tbody id="ithh9" style="box-sizing: border-box;">
			<tr id="if7y4" style="box-sizing: border-box; height: 100px;">
			  <td id="izrrw" style="box-sizing: border-box;">
				<section id="title-section" style="box-sizing: border-box; text-align: center;">
				  <div id="in50k" style="box-sizing: border-box; margin-bottom: 12px; font-size: 22px;">Your order is on the way!    
				  </div>
				  <div id="irq2q" style="box-sizing: border-box; line-height: 24px; color: #5F6368;">You can track your shipment by clicking the tracking number below.    
				  </div>
				</section>
				<div id="ifz3c" style="box-sizing: border-box; padding: 0 10px 0 0; font-size: 18px; line-height: 22px; margin: 16px 0 12px 0; text-align: left;">
				  <b id="i1nsw" style="box-sizing: border-box;">Order Details    
				  </b>
				</div>
				<section id="fulfillment-details-section" style="box-sizing: border-box; max-width: 650px; margin: 0 auto;">
				  <table id="ixye0d" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; margin: 0 0 25px 0;">
					<tbody id="id78mq" style="box-sizing: border-box;">
					  <tr id="iw1ztu" style="box-sizing: border-box;">
						<td id="ik8aq8" align="left" style="box-sizing: border-box; text-align: left;">
						  <div id="i5x1u4" style="box-sizing: border-box;">
							<div id="ibtttb" style="box-sizing: border-box; font-weight: bold; line-height: 24px;">USPS Tracking Number
							</div>
							<div id="ick7mz" style="box-sizing: border-box;">  {{shipping_receipt.tracking.id}}
							</div>
						  </div>
						</td>
						<td id="i3lzy8" align="right" style="box-sizing: border-box; text-align: right;">
						  <div id="iusvaf" style="box-sizing: border-box;">
							<div id="i31iir" style="box-sizing: border-box; font-weight: bold; line-height: 24px;">Shipped on
							</div>
							<div id="ih2gyf" style="box-sizing: border-box;">{{formatDate shipping_receipt.created_at 'MMM D, YYYY'}}
							</div>
						  </div>
						</td>
					  </tr>
					</tbody>
				  </table>
				</section>
				<table width="100%" height="60" id="i805o" style="box-sizing: border-box; height: 60px; width: 100%; font-size: 13px; border: 1px solid rgba(0,0,0,0.12);">
				  <tbody id="izmjf" style="box-sizing: border-box;">
					<tr id="iqdxw" style="box-sizing: border-box;">
					  <td id="iey8k" style="box-sizing: border-box; padding: 0 0 0 0;">
						<section id="order-basic-details-section" style="box-sizing: border-box; max-width: 650px; border-bottom: 1px solid #E5E5E5; margin: 0 auto; padding: 10px 10px 10px 10px;">
						  <table id="ifedw" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; font-weight: bold; color: #202124;">
							<tbody id="ikdtj" style="box-sizing: border-box;">
							  <tr id="in3hj" style="box-sizing: border-box;">
								<td id="ixg1a" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
								  <div id="i5c8o" style="box-sizing: border-box;">Order ID #{{rebill.alias}}
								  </div>
								</td>
								<td id="ikk5q" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%;">
								  <div id="i0jbh" style="box-sizing: border-box;">Order placed {{formatDate rebill.bill_at 'MMM D, YYYY'}}
								  </div>
								</td>
							  </tr>
							</tbody>
						  </table>
						</section>
						<section id="order-products-details-section" style="box-sizing: border-box; max-width: 650px; margin: 0 auto; padding: 0 0 0 0;">{{#rebill.products}}
						  <table id="ijpss" width="100%" style="box-sizing: border-box; font-size: 13px; border-bottom: 1px solid #E5E5E5; margin: 0 0 0 0; width: 100%;">
							<tbody id="islke" style="box-sizing: border-box;">
							  <tr id="iwfau" style="box-sizing: border-box; padding: 0 10px 0 0;">
								<td id="i6j2i" width="80%" align="left" style="box-sizing: border-box; text-align: left; width: 80%; padding: 10px 0;">
								  <table id="ia1j3" style="box-sizing: border-box;">
									<tbody id="ihb9j" style="box-sizing: border-box;">
									  <tr id="i7uu6" style="box-sizing: border-box;">
										<td id="ik5kxq" width="60" style="box-sizing: border-box; width: 60px;">
										  <img src="{{image}}" alt="" id="ik2q9r" style="box-sizing: border-box; min-width: 60px; max-width: 160px; min-height: 60px; background: grey; display: inline-block; margin: 0 0 0 10px;">
										</td>
										<td id="ir0ak" style="box-sizing: border-box;">
										  <div id="isn859" style="box-sizing: border-box; margin-left: 30px;">
											<div id="ixr048" style="box-sizing: border-box; line-height: 24px; font-weight: bold; font-size: 18px;">{{product.name}}
											</div>
											<div id="i3xru7" style="box-sizing: border-box; line-height: 24px; color: #5F6368;">QTY: {{quantity}}
											</div>
										  </div>
										</td>
									  </tr>
									</tbody>
								  </table>
								</td>
								<td id="irkb0y" width="20%" align="right" style="box-sizing: border-box; text-align: right; width: 20%; color: #5F6368; font-weight: bold; margin: 0  0 0; padding: 1px 10px 1px 1px;">\${{amount}}
								</td>
							  </tr>
							</tbody>
						  </table>{{/rebill.products}}    
						</section>
						<div id="izyhn" style="box-sizing: border-box;">
						  <section id="order-pricing--details-section" style="box-sizing: border-box; max-width: 650px; border-bottom: 1px solid #E5E5E5; margin: 0 auto; padding: 10px 10px 10px 10px;">
							<table id="ign7z4" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; color: #5F6368;">
							  <tbody id="ihmmc" style="box-sizing: border-box;">
								<tr id="insy4" style="box-sizing: border-box;">
								  <td id="iwxmrd" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
									<div id="iudfv" style="box-sizing: border-box;">Subtotal
									</div>
								  </td>
								  <td id="itw02j" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%; font-weight: bold;">
									<div id="i836v" style="box-sizing: border-box;">\${{rebill.amount}}
									</div>
								  </td>
								</tr>
							  </tbody>
							</table>{{#rebill.shipping_receipts}}
							<table id="irm2ys" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; color: #5F6368;">
							  <tbody id="iarmf" style="box-sizing: border-box;">
								<tr id="ipujg" style="box-sizing: border-box;">
								  <td id="ig5w4g" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
									<div id="ip3hx" style="box-sizing: border-box;">Shipping {{tracker.carrier}}
									</div>
								  </td>
								  <td id="i57fa3" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%; font-weight: bold;">
									<div id="ig9zj" style="box-sizing: border-box;">\${{amount}}
									</div>
								  </td>
								</tr>
							  </tbody>
							</table>{{/rebill.shipping_receipts}}
						  </section>
						  <section id="ip3r2q" style="box-sizing: border-box; text-align: right; max-width: 650px; margin: 10px auto 0; font-size: 20px; padding: 0 10px 10px 0;">Total 
							<span id="i7tugt" style="box-sizing: border-box; font-weight: bold;">\${{rebill.amount}}</span>
						  </section>
						</div>
					  </td>
					</tr>
				  </tbody>
				</table>
				<div id="in7pf" style="box-sizing: border-box; padding: 0 0 0 0; font-size: 18px; line-height: 22px; margin: 16px 0 12px 0; text-align: left;">
				  <b id="iw1vj" style="box-sizing: border-box;">Customer Information    
				  </b>
				</div>
				<table width="100%" height="60" id="icp3w" style="box-sizing: border-box; height: 60px; width: 100%; font-size: 13px; border: 1px solid rgba(0,0,0,0.12);">
				  <tbody id="i1nbg" style="box-sizing: border-box;">
					<tr id="ir6kji" valign="top" style="box-sizing: border-box; vertical-align: top;">
					  <td id="i2jjhm" width="50%" style="box-sizing: border-box; width: 50%; padding: 30px 0 30px 30px;">
						<section id="customer-shipping-section" style="box-sizing: border-box; text-align: left; height: 100%;">
						  <div id="i3os5f" style="box-sizing: border-box; line-height: 24px; font-weight: bold;">Shipping Address    
						  </div>
						  <div id="i3l4a2" style="box-sizing: border-box; color: #5F6368;">
							<div id="in3sf" style="box-sizing: border-box;">{{customer.firstname}} {{customer.lastname}}
							</div>
							<div id="ilj0h" style="box-sizing: border-box;">{{customer.address.line1}}
							</div>
							<div id="iljsx" style="box-sizing: border-box;">{{customer.address.line2}}
							</div>
							<div id="ir10n" style="box-sizing: border-box;">{{customer.address.city}}, {{customer.address.state}}
							</div>
							<div id="io1pd" style="box-sizing: border-box;">{{customer.address.zip}}
							</div>
						  </div>
						</section>
					  </td>
					  <td id="iiqavj" width="50%" style="box-sizing: border-box; width: 50%;">
						<section id="customer-billing-section" style="box-sizing: border-box; text-align: left; padding: 30px 30px 30px 0;">
						  <div id="i68b31" style="box-sizing: border-box; line-height: 24px; font-weight: bold;">Billing Information    
						  </div>
						  <div id="iu5hp4" style="box-sizing: border-box; color: #5F6368;">
							<div id="i02t7" style="box-sizing: border-box;">{{creditcard.name}}
							</div>
							<div id="ifxtj" style="box-sizing: border-box;">{{creditcard.address.line1}}
							</div>
							<div id="iokli" style="box-sizing: border-box;">{{creditcard.address.line2}}
							</div>
							<div id="ifpig" style="box-sizing: border-box;">{{creditcard.address.city}}, {{creditcard.address.state}}
							</div>
							<div id="iqomm" style="box-sizing: border-box;">{{creditcard.address.zip}}
							</div>
						  </div>
						  <div id="ifvr2a" style="box-sizing: border-box; margin-top: 12px; line-height: 24px; font-weight: bold;">Payment Method    
						  </div>
						  <div id="i1okl3" style="box-sizing: border-box; color: #5F6368;">{{creditcard.type}} ****{{creditcard.last_four}}    
						  </div>
						</section>
					  </td>
					</tr>
				  </tbody>
				</table>
			  </td>
			</tr>
		  </tbody>
		</table>
	  </td>
	</tr>
	<tr id="ik7kh" style="box-sizing: border-box; width: 100%; font-size: 12px; color: #5F6368; background: #C4C4C4;">
	  <td id="i567d" align="center" style="box-sizing: border-box; text-align: center; padding: 7px 12px;">
		<div id="ifhui" style="box-sizing: border-box;">If you have any questions about our privacy policy, contact our customer service center via     
		  <a href="mailto:{{accountdetails.support_email}}" id="ix8aw" style="box-sizing: border-box;">{{accountdetails.support_email}}</a>
		</div>
	  </td>
	</tr>
  </tbody>
</table>`;
}

function getDefaultAllFulfillmentsTemplateBody(): string {
  return `<table width="100%" style="box-sizing: border-box; width: 100%; font-family: Helvetica, Arial, Verdana, Trebuchet MS;">
  <tbody id="ib4f" style="box-sizing: border-box;">
	<tr id="ii4dh" style="box-sizing: border-box; height: 95px; background: #C4C4C4;">
	  <td id="irrfl" align="center" style="box-sizing: border-box; text-align: center; background: {{accountdetails.emailtemplatesettings.color_primary}};">
		<img src="{{accountdetails.company_logo}}" alt="Company Logo" id="iuzqz" style="box-sizing: border-box; max-height: 60px; min-height: 40px; min-width: 40px; color: #ffffff;">
	  </td>
	</tr>
	<tr id="irpi" style="box-sizing: border-box;">
	  <td id="i39sy" align="center" style="box-sizing: border-box; text-align: center;">
		<table id="ixqzi" width="100%" style="box-sizing: border-box; width: 100%; max-width: 650px; margin: 25px auto 60px; font-size: 13px;">
		  <tbody id="ithh9" style="box-sizing: border-box;">
			<tr id="if7y4" style="box-sizing: border-box; height: 100px;">
			  <td id="izrrw" style="box-sizing: border-box;">
				<section id="title-section" style="box-sizing: border-box; text-align: center;">
				  <div id="in50k" style="box-sizing: border-box; margin-bottom: 12px; font-size: 22px;">Your order is on the way!      
				  </div>
				  <div id="irq2q" style="box-sizing: border-box; line-height: 24px; color: #5F6368;">You can track your shipment by clicking the tracking number below.      
				  </div>
				</section>
				<div id="ifz3c" style="box-sizing: border-box; padding: 0 10px 0 0; font-size: 18px; line-height: 22px; margin: 16px 0 12px 0; text-align: left;">
				  <b id="i1nsw" style="box-sizing: border-box;">Order Details      
				  </b>
				</div>
				<section id="fulfillment-details-section" style="box-sizing: border-box; max-width: 650px; margin: 0 auto;">
				  <table id="ixye0d" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; margin: 0 0 25px 0;">
					<tbody id="id78mq" style="box-sizing: border-box;">
					  <tr id="iw1ztu" style="box-sizing: border-box;">
						<td id="ik8aq8" align="left" style="box-sizing: border-box; text-align: left;">
						  <div id="i5x1u4" style="box-sizing: border-box;">
							<div id="ibtttb" style="box-sizing: border-box; font-weight: bold; line-height: 24px;">USPS Tracking Number
							</div>
							<div id="ick7mz" style="box-sizing: border-box;">  {{shipping_receipt.tracking.id}}
							</div>
						  </div>
						</td>
						<td id="i3lzy8" align="right" style="box-sizing: border-box; text-align: right;">
						  <div id="iusvaf" style="box-sizing: border-box;">
							<div id="i31iir" style="box-sizing: border-box; font-weight: bold; line-height: 24px;">Shipped on
							</div>
							<div id="ih2gyf" style="box-sizing: border-box;">{{formatDate shipping_receipt.created_at 'MMM D, YYYY'}}
							</div>
						  </div>
						</td>
					  </tr>
					</tbody>
				  </table>
				</section>
				<table width="100%" height="60" id="i805o" style="box-sizing: border-box; height: 60px; width: 100%; font-size: 13px; border: 1px solid rgba(0,0,0,0.12);">
				  <tbody id="izmjf" style="box-sizing: border-box;">
					<tr id="iqdxw" style="box-sizing: border-box;">
					  <td id="iey8k" style="box-sizing: border-box; padding: 0 0 0 0;">
						<section id="order-basic-details-section" style="box-sizing: border-box; max-width: 650px; border-bottom: 1px solid #E5E5E5; margin: 0 auto; padding: 10px 10px 10px 10px;">
						  <table id="ifedw" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; font-weight: bold; color: #202124;">
							<tbody id="ikdtj" style="box-sizing: border-box;">
							  <tr id="in3hj" style="box-sizing: border-box;">
								<td id="ixg1a" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
								  <div id="i5c8o" style="box-sizing: border-box;">Order ID #{{rebill.alias}}  
								  </div>
								</td>
								<td id="ikk5q" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%;">
								  <div id="i0jbh" style="box-sizing: border-box;">Order placed {{formatDate rebill.bill_at 'MMM D, YYYY'}}  
								  </div>
								</td>
							  </tr>
							</tbody>
						  </table>
						</section>
						<section id="order-products-details-section" style="box-sizing: border-box; max-width: 650px; margin: 0 auto; padding: 0 0 0 0;">{{#rebill.products}}  
						  <table id="ijpss" width="100%" style="box-sizing: border-box; font-size: 13px; border-bottom: 1px solid #E5E5E5; margin: 0 0 0 0; width: 100%;">
							<tbody id="islke" style="box-sizing: border-box;">
							  <tr id="iwfau" style="box-sizing: border-box; padding: 0 10px 0 0;">
								<td id="i6j2i" width="80%" align="left" style="box-sizing: border-box; text-align: left; width: 80%; padding: 10px 0;">
								  <table id="ia1j3" style="box-sizing: border-box;">
									<tbody id="ihb9j" style="box-sizing: border-box;">
									  <tr id="i7uu6" style="box-sizing: border-box;">
										<td id="ik5kxq" width="60" style="box-sizing: border-box; width: 60px;">
										  <img src="{{image}}" alt="" id="ik2q9r" style="box-sizing: border-box; min-width: 60px; max-width: 160px; min-height: 60px; background: grey; display: inline-block; margin: 0 0 0 10px;">
										</td>
										<td id="ir0ak" style="box-sizing: border-box;">
										  <div id="isn859" style="box-sizing: border-box; margin-left: 30px;">
											<div id="ixr048" style="box-sizing: border-box; line-height: 24px; font-weight: bold; font-size: 18px;">{{product.name}}
											</div>
											<div id="i3xru7" style="box-sizing: border-box; line-height: 24px; color: #5F6368;">QTY: {{quantity}}
											</div>
										  </div>
										</td>
									  </tr>
									</tbody>
								  </table>
								</td>
								<td id="irkb0y" width="20%" align="right" style="box-sizing: border-box; text-align: right; width: 20%; color: #5F6368; font-weight: bold; margin: 0  0 0; padding: 1px 10px 1px 1px;">\${{amount}}
								</td>
							  </tr>
							</tbody>
						  </table>{{/rebill.products}}    
						</section>
						<div id="izyhn" style="box-sizing: border-box;">
						  <section id="order-pricing--details-section" style="box-sizing: border-box; max-width: 650px; border-bottom: 1px solid #E5E5E5; margin: 0 auto; padding: 10px 10px 10px 10px;">
							<table id="ign7z4" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; color: #5F6368;">
							  <tbody id="ihmmc" style="box-sizing: border-box;">
								<tr id="insy4" style="box-sizing: border-box;">
								  <td id="iwxmrd" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
									<div id="iudfv" style="box-sizing: border-box;">Subtotal
									</div>
								  </td>
								  <td id="itw02j" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%; font-weight: bold;">
									<div id="i836v" style="box-sizing: border-box;">\${{rebill.amount}}
									</div>
								  </td>
								</tr>
							  </tbody>
							</table>{{#rebill.shipping_receipts}}
							<table id="irm2ys" width="100%" style="box-sizing: border-box; width: 100%; font-size: 13px; color: #5F6368;">
							  <tbody id="iarmf" style="box-sizing: border-box;">
								<tr id="ipujg" style="box-sizing: border-box;">
								  <td id="ig5w4g" width="50%" align="left" style="box-sizing: border-box; text-align: left; width: 50%;">
									<div id="ip3hx" style="box-sizing: border-box;">Shipping {{tracker.carrier}}
									</div>
								  </td>
								  <td id="i57fa3" width="50%" align="right" style="box-sizing: border-box; text-align: right; width: 50%; font-weight: bold;">
									<div id="ig9zj" style="box-sizing: border-box;">\${{amount}}
									</div>
								  </td>
								</tr>
							  </tbody>
							</table>{{/rebill.shipping_receipts}}  
						  </section>
						  <section id="ip3r2q" style="box-sizing: border-box; text-align: right; max-width: 650px; margin: 10px auto 0; font-size: 20px; padding: 0 10px 10px 0;">Total 
							<span id="i7tugt" style="box-sizing: border-box; font-weight: bold;">\${{rebill.amount}}</span>
						  </section>
						</div>
					  </td>
					</tr>
				  </tbody>
				</table>
				<div id="in7pf" style="box-sizing: border-box; padding: 0 0 0 0; font-size: 18px; line-height: 22px; margin: 16px 0 12px 0; text-align: left;">
				  <b id="iw1vj" style="box-sizing: border-box;">Customer Information      
				  </b>
				</div>
				<table width="100%" height="60" id="icp3w" style="box-sizing: border-box; height: 60px; width: 100%; font-size: 13px; border: 1px solid rgba(0,0,0,0.12);">
				  <tbody id="i1nbg" style="box-sizing: border-box;">
					<tr id="ir6kji" valign="top" style="box-sizing: border-box; vertical-align: top;">
					  <td id="i2jjhm" width="50%" style="box-sizing: border-box; width: 50%; padding: 30px 0 30px 30px;">
						<section id="customer-shipping-section" style="box-sizing: border-box; text-align: left; height: 100%;">
						  <div id="i3os5f" style="box-sizing: border-box; line-height: 24px; font-weight: bold;">Shipping Address      
						  </div>
						  <div id="i3l4a2" style="box-sizing: border-box; color: #5F6368;">
							<div id="in3sf" style="box-sizing: border-box;">{{customer.firstname}} {{customer.lastname}}
							</div>
							<div id="ilj0h" style="box-sizing: border-box;">{{customer.address.line1}}
							</div>
							<div id="iljsx" style="box-sizing: border-box;">{{customer.address.line2}}
							</div>
							<div id="ir10n" style="box-sizing: border-box;">{{customer.address.city}}, {{customer.address.state}}
							</div>
							<div id="io1pd" style="box-sizing: border-box;">{{customer.address.zip}}
							</div>
						  </div>
						</section>
					  </td>
					  <td id="iiqavj" width="50%" style="box-sizing: border-box; width: 50%;">
						<section id="customer-billing-section" style="box-sizing: border-box; text-align: left; padding: 30px 30px 30px 0;">
						  <div id="i68b31" style="box-sizing: border-box; line-height: 24px; font-weight: bold;">Billing Information      
						  </div>
						  <div id="iu5hp4" style="box-sizing: border-box; color: #5F6368;">
							<div id="i02t7" style="box-sizing: border-box;">{{creditcard.name}}
							</div>
							<div id="ifxtj" style="box-sizing: border-box;">{{creditcard.address.line1}}
							</div>
							<div id="iokli" style="box-sizing: border-box;">{{creditcard.address.line2}}
							</div>
							<div id="ifpig" style="box-sizing: border-box;">{{creditcard.address.city}}, {{creditcard.address.state}}
							</div>
							<div id="iqomm" style="box-sizing: border-box;">{{creditcard.address.zip}}
							</div>
						  </div>
						  <div id="ifvr2a" style="box-sizing: border-box; margin-top: 12px; line-height: 24px; font-weight: bold;">Payment Method      
						  </div>
						  <div id="i1okl3" style="box-sizing: border-box; color: #5F6368;">{{creditcard.type}} ****{{creditcard.last_four}}      
						  </div>
						</section>
					  </td>
					</tr>
				  </tbody>
				</table>
			  </td>
			</tr>
		  </tbody>
		</table>
	  </td>
	</tr>
	<tr id="ik7kh" style="box-sizing: border-box; width: 100%; font-size: 12px; color: #5F6368; background: #C4C4C4;">
	  <td id="i567d" align="center" style="box-sizing: border-box; text-align: center; padding: 7px 12px;">
		<div id="ifhui" style="box-sizing: border-box;">If you have any questions about our privacy policy, contact our customer service center via       
		  <a href="mailto:{{accountdetails.support_email}}" id="ix8aw" style="box-sizing: border-box;">{{accountdetails.support_email}}</a>
		</div>
	  </td>
	</tr>
  </tbody>
</table>`;
}