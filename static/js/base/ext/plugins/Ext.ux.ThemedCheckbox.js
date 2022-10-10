Ext.override(Ext.form.Checkbox, {
	checked: undefined,
	actionMode: 'wrap',
	innerCls: 'x-form-checkbox-inner',
	onResize: function(){
		Ext.form.Checkbox.superclass.onResize.apply(this, arguments);
		if(!this.boxLabel){
			this.innerWrap.alignTo(this.wrap, 'c-c');
		}
	},
	initEvents: function(){
		Ext.form.Checkbox.superclass.initEvents.call(this);
		this.mon(this.el, {
			click: this.onClick,
			change: this.onClick,
			mouseenter: this.onMouseEnter,
			mouseleave: this.onMouseLeave,
			mousedown: this.onMouseDown,
			mouseup: this.onMouseUp,
			scope: this
		});
	},
	onRender: function(ct, position){
		Ext.form.Checkbox.superclass.onRender.call(this, ct, position);
		if(this.inputValue !== undefined){
			this.el.dom.value = this.inputValue;
		}else{
			this.inputValue = this.el.dom.value;
		}
		this.innerWrap = this.el.wrap({
			cls: this.innerCls
		});
		this.wrap = this.innerWrap.wrap({
			cls: 'x-form-check-wrap'
		});
		if(this.boxLabel){
			this.labelEl = this.wrap.createChild({
				tag: 'label',
				htmlFor: this.el.id,
				cls: 'x-form-cb-label',
				html: this.boxLabel
			});
		}else{
			this.innerWrap.addClass('x-form-check-no-label');
		}
	},
	initValue: function(){
		if(this.checked !== undefined){
			this.setValue(this.checked);
		}else{
			if(this.value !== undefined){
				this.setValue(this.value);
			}
			this.checked = this.el.dom.checked;
		}
		this.originalValue = this.getValue();
	},
	getRawValue: function(){
		return this.rendered ? this.el.dom.checked : this.checked;
	},
	getValue: function(){
		return this.getRawValue() ? this.inputValue : undefined;
	},
	onClick: function(){
		if(Ext.isSafari){
			this.focus();
		}
		if(this.el.dom.checked != this.checked){
			this.setValue(this.el.dom.checked);
		}
	},
	setValue: function(v){
		this.checked = typeof v == 'boolean' ? v : v == this.inputValue;
		if(this.rendered){
			this.el.dom.checked = this.checked;
			this.el.dom.defaultChecked = this.checked;
			this.innerWrap[this.checked ? 'addClass' : 'removeClass']('x-form-check-checked');
			this.validate();
		}
		this.fireEvent('check', this, this.checked);
		return this;
	},
	onMouseEnter: function(){
		this.wrap.addClass('x-form-check-over');
	},
	onMouseLeave: function(){
		this.wrap.removeClass('x-form-check-over');
	},
	onMouseDown: function(){
		this.wrap.addClass('x-form-check-down');
	},
	onMouseUp: function(){
		this.wrap.removeClass('x-form-check-down');
	},
	onFocus: function(){
		Ext.form.Checkbox.superclass.onFocus.call(this);
		this.wrap.addClass('x-form-check-focus');
	},
	onBlur: function(){
		Ext.form.Checkbox.superclass.onBlur.call(this);
		this.wrap.removeClass('x-form-check-focus');
	}
});
Ext.override(Ext.form.Radio, {
	innerCls: 'x-form-radio-inner',
	onClick: Ext.form.Radio.superclass.onClick,
	setValue: function(v){
		Ext.form.Radio.superclass.setValue.call(this, v);
		if(this.rendered && this.checked){
			var p = this.el.up('form') || Ext.getBody(),
				els = p.select('input[name=' + this.el.dom.name + ']'),
				id = this.el.dom.id;
			els.each(function(el){
				if(el.dom.id != id){
					Ext.getCmp(el.dom.id).setValue(false);
				}
			});
		}
		return this;
	}
});

Ext.override(Ext.form.Field, {
	markEl: 'el',
	markInvalid: function(msg){
		if(!this.rendered || this.preventMark){
			return;
		}
		msg = msg || this.invalidText;
		var mt = this.getMessageHandler();
		if(mt){
			mt.mark(this, msg);
		}else if(this.msgTarget){
			this[this.markEl].addClass(this.invalidClass);
			var t = Ext.getDom(this.msgTarget);
			if(t){
				t.innerHTML = msg;
				t.style.display = this.msgDisplay;
			}
		}
		this.fireEvent('invalid', this, msg);
	},
	clearInvalid : function(){
		if(!this.rendered || this.preventMark){
			return;
		}
		var mt = this.getMessageHandler();
		if(mt){
			mt.clear(this);
		}else if(this.msgTarget){
			this[this.markEl].removeClass(this.invalidClass);
			var t = Ext.getDom(this.msgTarget);
			if(t){
				t.innerHTML = '';
				t.style.display = 'none';
			}
		}
		this.fireEvent('valid', this);
	}
});
Ext.apply(Ext.form.MessageTargets, {
	'qtip': {
		mark: function(field, msg){
			var markEl = field[field.markEl];
			markEl.addClass(field.invalidClass);
			markEl.dom.qtip = msg;
			markEl.dom.qclass = 'x-form-invalid-tip';
			if(Ext.QuickTips){
				Ext.QuickTips.enable();
			}
		},
		clear: function(field){
			var markEl = field[field.markEl];
			markEl.removeClass(field.invalidClass);
			markEl.dom.qtip = '';
		}
	},
	'title': {
		mark: function(field, msg){
			var markEl = field[field.markEl];
			markEl.addClass(field.invalidClass);
			markEl.dom.title = msg;
		},
		clear: function(field){
			field[field.markEl].dom.title = '';
		}
	},
	'under': {
		mark: function(field, msg){
			var markEl = field[field.markEl], errorEl = field.errorEl;
			markEl.addClass(field.invalidClass);
			if(!errorEl){
				var elp = field.getErrorCt();
				if(!elp){
					markEl.dom.title = msg;
					return;
				}
				errorEl = field.errorEl = elp.createChild({cls:'x-form-invalid-msg'});
				errorEl.setWidth(elp.getWidth(true) - 20);
			}
			errorEl.update(msg);
			Ext.form.Field.msgFx[field.msgFx].show(errorEl, field);
		},
		clear: function(field){
			var markEl = field[field.markEl], errorEl = field.errorEl;
			markEl.removeClass(field.invalidClass);
			if(errorEl){
				Ext.form.Field.msgFx[field.msgFx].hide(errorEl, field);
			}else{
				markEl.dom.title = '';
			}
		}
	},
	'side': {
		mark: function(field, msg){
			var markEl = field[field.markEl], errorIcon = field.errorIcon;
			markEl.addClass(field.invalidClass);
			if(!errorIcon){
				var elp = field.getErrorCt();
				if(!elp){
					markEl.dom.title = msg;
					return;
				}
				errorIcon = field.errorIcon = elp.createChild({cls:'x-form-invalid-icon'});
			}
			field.alignErrorIcon();
			errorIcon.dom.qtip = msg;
			errorIcon.dom.qclass = 'x-form-invalid-tip';
			errorIcon.show();
			field.on('resize', field.alignErrorIcon, field);
		},
		clear: function(field){
			var markEl = field[field.markEl], errorIcon = field.errorIcon;
			markEl.removeClass(field.invalidClass);
			if(errorIcon){
				errorIcon.dom.qtip = '';
				errorIcon.hide();
				field.un('resize', field.alignErrorIcon, field);
			}else{
				markEl.dom.title = '';
			}
		}
	}
});
Ext.override(Ext.form.Checkbox, {
	markEl: 'wrap',
	mustCheckText: 'This field is required',
	alignErrorIcon: function(){
		this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
	},
	markInvalid: Ext.form.Checkbox.superclass.markInvalid,
	clearInvalid: Ext.form.Checkbox.superclass.clearInvalid,
	validateValue : function(value){
		if(this.mustCheck && !value){
			this.markInvalid(this.mustCheckText);
			return false;
		}
		if(this.vtype){
			var vt = Ext.form.VTypes;
			if(!vt[this.vtype](value, this)){
				this.markInvalid(this.vtypeText || vt[this.vtype +'Text']);
				return false;
			}
		}
		if(typeof this.validator == "function"){
			var msg = this.validator(value);
			if(msg !== true){
				this.markInvalid(msg);
				return false;
			}
		}
		if(this.regex && !this.regex.test(value)){
			this.markInvalid(this.regexText);
			return false;
		}
		return true;
	}
});
Ext.override(Ext.form.Radio, {
	markInvalid: Ext.form.Radio.superclass.markInvalid,
	clearInvalid: Ext.form.Radio.superclass.clearInvalid
});