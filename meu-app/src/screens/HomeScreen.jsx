import { useState, useEffect } from 'react';

function HomeScreen() {
  const [dataAtual, setDataAtual] = useState('');

  useEffect(() => {
    const data = new Date().toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setDataAtual(data);
  }, []);

  const eventos = [
    { nome: 'Dia do Trabalho', data: '30 de abril', cor: '#1D9E75' },
    { nome: 'Dia dos Namorados - Sem Aula', data: '11 de junho', cor: '#D85A30' },
    { nome: 'Conselho de Classe', data: '18 de junho', cor: '#378ADD' },
  ];

  const diasSemana = [
    { dia: 'Seg', aulas: 5 },
    { dia: 'Ter', aulas: 5 },
    { dia: 'Qua', aulas: 3 },
    { dia: 'Qui', aulas: 3 },
    { dia: 'Sex', aulas: 3 },
  ];

  const navItems = [
    'Início', 'Horário Semanal', 'Editar Horário',
    'Feriados e Eventos', 'Importar/Exportar', 'Configurações'
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#eaeaea', fontFamily: 'sans-serif' }}>

      {/* Sidebar */}
      <aside style={{ width: 200, backgroundColor: '#fff', borderRight: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
        <div style={{ padding: '0 20px 16px', borderBottom: '1px solid #e5e5e5', marginBottom: 8 }}>
          <p style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>Meu Horário</p>
          <p style={{ fontSize: 12, color: '#888', margin: 0 }}>Escolar</p>
        </div>
        {navItems.map((item) => (
          <div key={item} style={{
            padding: '9px 20px',
            fontSize: 13,
            cursor: 'pointer',
            backgroundColor: item === 'Início' ? '#111' : 'transparent',
            color: item === 'Início' ? '#fff' : '#555',
            margin: item === 'Início' ? '0 8px' : '0',
            borderRadius: item === 'Início' ? 8 : 0,
          }}>
            {item}
          </div>
        ))}
        <p style={{ marginTop: 'auto', padding: '0 20px', fontSize: 11, color: '#bbb' }}>Versão 1.0.0</p>
      </aside>

      {/* Conteúdo principal */}
      <main style={{ flex: 1, padding: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Olá, estudante! 👋</h1>
        <p style={{ color: '#888', marginTop: 4, marginBottom: 20 }}>{dataAtual}</p>

        {/* Cards superiores */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, padding: 20 }}>
            <p style={{ fontSize: 12, color: '#888', margin: '0 0 8px' }}>🕐 Próxima aula</p>
            <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>Sem aulas programadas</h2>
            <p style={{ margin: 0, color: '#888', fontSize: 13 }}>Aproveite para descansar ou estudar!</p>
          </div>
          <div style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, padding: 20 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>Aulas de hoje</h3>
            <p style={{ margin: 0, color: '#888', fontSize: 13 }}>Nenhuma aula hoje</p>
          </div>
        </div>

        {/* Cards inferiores */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, padding: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15 }}>Visão da Semana</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {diasSemana.map((item) => (
                <div key={item.dia} style={{ flex: 1, textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: 8, padding: '10px 4px' }}>
                  <p style={{ fontSize: 11, color: '#676767', margin: 0 }}>{item.dia}</p>
                  <p style={{ fontSize: 20, fontWeight: 600, margin: '4px 0 2px' }}>{item.aulas}</p>
                  <p style={{ fontSize: 10, color: '#676767', margin: 0 }}>aulas</p>
                </div>
              ))}
            </div>
            <button style={{ width: '100%', padding: 10, backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
              Ver horário completo ›
            </button>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, padding: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15 }}>Próximos Eventos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {eventos.map((evento) => (
                <div key={evento.nome} style={{ display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#f9f9f9', border: '1px solid #e5e5e5', borderRadius: 8, padding: '10px 14px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: evento.cor, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{evento.nome}</p>
                    <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{evento.data}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomeScreen;