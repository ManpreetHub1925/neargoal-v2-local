# MANUAL RESTORE TO PRE-SEARCH VERSION

## 1. Stop Server
```
Ctrl+C
```

## 2. Delete Search Files  
```
rm SEARCH_TODO.md
```

## 3. Revert app.py - Run these edit_file commands:

**A) Remove search-suggestions route**
```
Use edit_file: delete @main.route('/search-suggestions')
```

**B) Fix inject_layout_data()**
```
old: \"href\": \"/market-updates/...\" 
new: \"href\": url_for(\"market_updates\", ...)
```

**C) Add root '/' route if missing**
```
@main.route('/')
def home():
    return redirect(url_for('market_intelligence'))
```

## 4. Test
```
python3 app.py
curl http://127.0.0.1:5000/
curl http://127.0.0.1:5000/admin/login  # Should 200
```

**Copy-paste the edit_file blocks when ready.**

