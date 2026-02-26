const formatUnixDate = (unixTsString: string) => {
  const unixTs = Number.parseInt(unixTsString);
  const date = new Date(unixTs * 1000);

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return formatter.format(date);
};

export default formatUnixDate;
