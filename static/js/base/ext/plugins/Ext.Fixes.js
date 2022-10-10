// fix combo focus -> expand bug
Ext.override(Ext.form.TriggerField, {
    setEditable: function(value){
        if (value == this.editable) {
            return;
        }
        this.editable = value;
        if (!value) {
            this.el.addClass('x-trigger-noedit').on('mousedown', this.onTriggerClick, this).dom.setAttribute('readOnly', true);
        }
        else {
            this.el.removeClass('x-trigger-noedit').un('mousedown', this.onTriggerClick, this).dom.removeAttribute('readOnly');
        }
    }
});

Ext.override(Ext.form.Field, {
   afterRender: function(){
        this.addListener('focus',function(){
			this.ownerCt.addClass("ctr-focus");
		});
		this.addListener('blur',function(){
			this.ownerCt.removeClass("ctr-focus");
		});
        Ext.form.Field.superclass.afterRender.call(this);
        this.initEvents();
    }
});

Ext.override(Ext.form.CheckboxGroup, {
  getNames: function() {
    var n = [];

    this.items.each(function(item) {
      if (item.getValue()) {
        n.push(item.getName());
      }
    });

    return n;
  },

  getValues: function() {
    var v = [];

    this.items.each(function(item) {
      if (item.getValue()) {
        v.push(item.getRawValue());
      }
    });

    return v;
  },

  setValues: function(v) {
    var r = new RegExp('(' + v.join('|') + ')');
	
    this.items.each(function(item) {
		item.setValue(r.test(item.value));
    });
  }
});

Ext.override(Ext.form.RadioGroup, {
  getValue: function() {
    return this.items.first().getGroupValue();
  }
});

Ext.override(Ext.Element, {
    scrollIntoView : function(container, hscroll){
        var c = Ext.getDom(container) || Ext.getBody().dom;
        var el = this.dom;

        var o = this.getOffsetsTo(c),
            s = this.getScroll(),
            l = o[0] + s.left,
            t = o[1] + s.top,
            b = t + el.offsetHeight,
            r = l + el.offsetWidth;

        var ch = c.clientHeight;
        var ct = parseInt(c.scrollTop, 10);
        var cl = parseInt(c.scrollLeft, 10);
        var cb = ct + ch;
        var cr = cl + c.clientWidth;

        if(el.offsetHeight > ch || t < ct){
            c.scrollTop = t;
        }else if(b > cb){
            c.scrollTop = b-ch;
        }
        c.scrollTop = c.scrollTop; // corrects IE, other browsers will ignore

        if(hscroll !== false){
            if(el.offsetWidth > c.clientWidth || l < cl){
                c.scrollLeft = l;
            }else if(r > cr){
                c.scrollLeft = r-c.clientWidth;
            }
            c.scrollLeft = c.scrollLeft;
        }
        return this;
    }
});

/**
 * cfg {Function} filterFn
 * <p><b>Optional</b> A Function used to filter a <b>local</b> store during typing. An implementation of this may
 * be configured into the ComboBox to provide custom filtering of the Store's content based upon
 * the typed value.</p>
 * <p>The provided implementation does case-insensitive matching on the {@link #displayField}.</p>
 * <p>The function is called using the scope (<tt><b>this</b></tt> reference) of the ComboBox, and
 * is passed the following parameters:</p><div class="mdetail-params"><ul>
 * <li>r : Record<div class="sub-desc">The Record being tested for inclusion in the filtered dataset.</div></li>
 * <li>id : Object<div class="sub-desc">The Record's ID.</div></li>
 * <li>v : String<div class="sub-desc">The typed value.</div></li>
 * </ul></div>
 */
Ext.override(Ext.form.ComboBox, {
    filter : function(value){
    	if(this.filterFn){
    		return this.store.filterBy(this.filterFn.createDelegate(this, [value], true));
    	}
    	return this.store.filter(this.displayField, value, this.anyMatch, this.caseSensitive);
    },
    doQuery : function(q, forceAll){
        q = Ext.isEmpty(q) ? '' : q;
        var qe = {
            query: q,
            forceAll: forceAll,
            combo: this,
            cancel:false
        };
        if(this.fireEvent('beforequery', qe)===false || qe.cancel){
            return false;
        }
        q = qe.query;
        forceAll = qe.forceAll;
        if(forceAll === true || (q.length >= this.minChars)){
            if(this.lastQuery !== q){
                this.lastQuery = q;
                if(this.mode == 'local'){
                    this.selectedIndex = -1;
                    if(forceAll){
                        this.store.clearFilter();
                    }else{
                        this.filter(q);
                    }
                    this.onLoad();
                }else{
                    this.store.baseParams[this.queryParam] = q;
                    this.store.load({
                        params: this.getParams(q)
                    });
                    this.expand();
                }
            }else{
                this.selectedIndex = -1;
                this.onLoad();
            }
        }
    }
});


Ext.override(Ext.grid.GridPanel, {
    autoSizeColumns: function() {
		for (var i = 0; i < this.colModel.getColumnCount(); i++) {
		this.autoSizeColumn(i);
		}
	},

	autoSizeColumn: function(c) {
		var w = this.view.getHeaderCell(c).firstChild.scrollWidth;
		for (var i = 0, l = this.store.getCount(); i < l; i++) {
			w = Math.max(w, this.view.getCell(i, c).firstChild.scrollWidth+6);
		}
		this.colModel.setColumnWidth(c, w);
		return w;
	}
});