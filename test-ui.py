from playwright.sync_api import sync_playwright
import json
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1100},device_scale_factor=1);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://localhost:4200');page.wait_for_timeout(1800)
 page.screenshot(path='/home/user/logistics-guide.report/desktop.png',full_page=True)
 page.get_by_role('button',name='Entregas pendentes',exact=False).click();page.get_by_role('dialog').wait_for();assert page.get_by_role('dialog').get_by_text('192 registros demonstrativos').is_visible();page.keyboard.press('Escape');assert page.get_by_role('dialog').count()==0
 page.get_by_label('Buscar por Nota Fiscal, CTe ou cliente').fill('840103');assert page.locator('tbody tr').count()==1
 page.get_by_role('button',name='Limpar filtros').click();assert page.locator('tbody tr').count()==6
 page.get_by_role('button',name='Próxima página').click();assert '7–12' in page.locator('.pagination').inner_text()
 page.locator('tbody tr').first.get_by_role('button').click();assert page.get_by_role('dialog').get_by_text('Nota Fiscal',exact=True).is_visible();page.keyboard.press('Escape')
 for c in ['trd','dey','tragetta','pacifico']:
  for a in ['visao-geral','analise','armazenagem','importar']:
   page.goto(f'http://localhost:4200/transportadora/{c}/{a}');page.locator('h1').wait_for();assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'),(c,a)
 page.goto('http://localhost:4200/transportadora/trd/armazenagem');page.wait_for_timeout(700);page.screenshot(path='/home/user/logistics-guide.report/armazenagem.png',full_page=True)
 page.get_by_role('button',name='Próximos ao limite',exact=False).click();assert page.get_by_role('dialog').is_visible();page.keyboard.press('Escape')
 page.goto('http://localhost:4200/transportadora/trd/importar')
 page.locator('input[type=file]').set_input_files({'name':'teste.pdf','mimeType':'application/pdf','buffer':b'demo'});assert page.get_by_role('alert').is_visible()
 page.locator('input[type=file]').set_input_files({'name':'operacao.csv','mimeType':'text/csv','buffer':b'nf,cliente\n1,Demo'});page.get_by_role('button',name='Importar e analisar').click();assert page.get_by_text('Simulação concluída com sucesso').is_visible();page.get_by_role('button',name='Limpar dados').click();assert page.locator('.selected-file').count()==0
 page.get_by_role('button',name='Central de ajuda').click();assert page.get_by_text('Explore o protótipo').is_visible();page.keyboard.press('Escape')
 page.set_viewport_size({'width':390,'height':844});page.goto('http://localhost:4200');page.wait_for_timeout(900);assert not page.evaluate('document.documentElement.scrollWidth > innerWidth');assert page.locator('.kpi-grid').evaluate("e=>getComputedStyle(e).gridTemplateColumns").split(' ').__len__()==1
 page.screenshot(path='/home/user/logistics-guide.report/mobile.png',full_page=True)
 page.get_by_role('button',name='Abrir menu').click();assert page.locator('.sidebar.is-open').is_visible();page.get_by_role('link',name='Análise',exact=True).click();assert 'analise' in page.url;assert page.locator('.sidebar.is-open').count()==0
 for a in ['visao-geral','analise','armazenagem','importar']:
  page.goto(f'http://localhost:4200/transportadora/trd/{a}');page.locator('h1').wait_for();assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'),a
 assert not errors,errors
 print(json.dumps({'passed':['17 rotas desktop','4 áreas mobile','modal de pendentes e FreeTime','Escape','busca e limpeza','paginação','detalhe de nota','formato inválido','importação simulada','ajuda','menu mobile','KPIs em coluna','sem overflow global'],'pageErrors':errors},ensure_ascii=False,indent=2))
 b.close()
